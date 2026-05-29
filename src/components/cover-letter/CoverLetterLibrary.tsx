"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  deleteCoverLetterAction,
  duplicateCoverLetterAction,
  renameCoverLetterAction,
} from "@/app/(app)/cover-letters/actions";
import { formatDateTime } from "@/lib/datetime";
import { downloadCoverLetterPdf } from "@/lib/cover-letter-download";
import type { CoverLetterLibraryItem } from "@/lib/cover-letter-types";

type CoverLetterLibraryProps = {
  letters: CoverLetterLibraryItem[];
};

export function CoverLetterLibrary({ letters }: CoverLetterLibraryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuLetterId, setMenuLetterId] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameLabel, setRenameLabel] = useState("");
  const [renameLetterId, setRenameLetterId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLetterId, setDeleteLetterId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const menuLetter = letters.find((l) => l.id === menuLetterId) ?? null;
  const deleteLetter = letters.find((l) => l.id === deleteLetterId) ?? null;

  function openMenu(event: React.MouseEvent<HTMLElement>, letterId: string) {
    setMenuAnchor(event.currentTarget);
    setMenuLetterId(letterId);
  }

  function closeMenu() {
    setMenuAnchor(null);
    setMenuLetterId(null);
  }

  function runAction(
    action: () => Promise<{ error?: string; success?: boolean }>,
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      closeMenu();
      setRenameOpen(false);
      setDeleteOpen(false);
      router.refresh();
    });
  }

  if (letters.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Your cover letters
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}

      <List disablePadding>
        {letters.map((letter) => (
          <ListItem
            key={letter.id}
            disablePadding
            sx={{
              mb: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`Actions for ${letter.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openMenu(e, letter.id);
                }}
                disabled={isPending}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() =>
                router.push(`/cover-letters/create?id=${letter.id}`)
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MailOutlineOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={letter.label}
                secondary={`Updated ${formatDateTime(new Date(letter.updatedAt))}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        {menuLetter ? (
          <MenuItem
            onClick={() => {
              closeMenu();
              router.push(`/cover-letters/create?id=${menuLetter.id}`);
            }}
          >
            <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        ) : null}
        {menuLetter ? (
          <MenuItem
            disabled={isPending}
            onClick={() => {
              if (!menuLetter) return;
              runAction(() => duplicateCoverLetterAction(menuLetter.id));
            }}
          >
            <ContentCopyOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            Duplicate
          </MenuItem>
        ) : null}
        {menuLetter ? (
          <MenuItem
            disabled={downloading || isPending}
            onClick={() => {
              if (!menuLetter) return;
              closeMenu();
              setError(null);
              setDownloading(true);
              void downloadCoverLetterPdf(menuLetter.id, menuLetter.label)
                .catch((err) => {
                  setError(
                    err instanceof Error ? err.message : "Download failed.",
                  );
                })
                .finally(() => {
                  setDownloading(false);
                });
            }}
          >
            <DownloadOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            {downloading ? "Downloading…" : "Download PDF"}
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={() => {
            if (!menuLetter) return;
            setRenameLetterId(menuLetter.id);
            setRenameLabel(menuLetter.label);
            setRenameOpen(true);
            closeMenu();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!menuLetter) return;
            setDeleteLetterId(menuLetter.id);
            setDeleteOpen(true);
            closeMenu();
          }}
        >
          <DeleteOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
        <DialogTitle>Rename cover letter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Label"
            fullWidth
            value={renameLabel}
            onChange={(e) => setRenameLabel(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isPending || renameLabel.trim() === ""}
            onClick={() => {
              if (!renameLetterId) return;
              runAction(() =>
                renameCoverLetterAction(renameLetterId, renameLabel),
              );
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete cover letter?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete &ldquo;{deleteLetter?.label}&rdquo;? Applications linked to
            this letter will no longer show it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={isPending}
            onClick={() => {
              if (!deleteLetterId) return;
              runAction(() => deleteCoverLetterAction(deleteLetterId));
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
