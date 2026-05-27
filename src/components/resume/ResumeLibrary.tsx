"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  deleteResumeAction,
  renameResumeAction,
  setDefaultResumeAction,
} from "@/app/(app)/resume/actions";
import { ResumeDownloadButton } from "@/components/resume/ResumeDownloadButton";
import { formatDateTime } from "@/lib/datetime";

export type ResumeLibraryItem = {
  id: string;
  kind: "BUILT" | "UPLOADED";
  label: string;
  isDefault: boolean;
  updatedAt: string;
};

type ResumeLibraryProps = {
  resumes: ResumeLibraryItem[];
  selectedId: string | null;
};

export function ResumeLibrary({ resumes, selectedId }: ResumeLibraryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuResumeId, setMenuResumeId] = useState<string | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameLabel, setRenameLabel] = useState("");
  const [renameResumeId, setRenameResumeId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteResumeId, setDeleteResumeId] = useState<string | null>(null);

  const menuResume = resumes.find((r) => r.id === menuResumeId) ?? null;
  const renameResume = resumes.find((r) => r.id === renameResumeId) ?? null;
  const deleteResume = resumes.find((r) => r.id === deleteResumeId) ?? null;
  const selected =
    resumes.find((r) => r.id === selectedId) ??
    resumes.find((r) => r.isDefault) ??
    resumes[0] ??
    null;

  function openMenu(event: React.MouseEvent<HTMLElement>, resumeId: string) {
    setMenuAnchor(event.currentTarget);
    setMenuResumeId(resumeId);
  }

  function closeMenu() {
    setMenuAnchor(null);
    setMenuResumeId(null);
  }

  function runAction(action: () => Promise<{ error?: string; success?: boolean }>) {
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

  if (resumes.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2, justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <Typography variant="h6" component="h2">
          Your resumes
        </Typography>
        <ResumeDownloadButton
          resumeId={selected?.id ?? null}
          kind={selected?.kind ?? null}
        />
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}

      <List disablePadding>
        {resumes.map((resume) => (
          <ListItem
            key={resume.id}
            disablePadding
            sx={{
              mb: 1,
              border: 1,
              borderColor: selectedId === resume.id ? "primary.main" : "divider",
              borderRadius: 1,
              bgcolor: selectedId === resume.id ? "action.selected" : "background.paper",
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`Actions for ${resume.label}`}
                onClick={(e) => openMenu(e, resume.id)}
                disabled={isPending}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemIcon sx={{ minWidth: 40, pl: 1.5 }}>
              {resume.kind === "BUILT" ? (
                <ArticleOutlinedIcon color="primary" />
              ) : (
                <PictureAsPdfOutlinedIcon color="action" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="subtitle1">{resume.label}</Typography>
                  {resume.isDefault ? (
                    <Chip label="Default" size="small" color="primary" variant="outlined" />
                  ) : null}
                  <Chip
                    label={resume.kind === "BUILT" ? "Built" : "Uploaded"}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              }
              secondary={`Updated ${formatDateTime(new Date(resume.updatedAt))}`}
            />
          </ListItem>
        ))}
      </List>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        {menuResume?.kind === "BUILT" ? (
          <MenuItem
            onClick={() => {
              closeMenu();
              router.push(`/resume?id=${menuResume.id}`);
            }}
          >
            <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        ) : null}
        <MenuItem
          disabled={menuResume?.isDefault}
          onClick={() => {
            if (!menuResume) return;
            runAction(() => setDefaultResumeAction(menuResume.id));
          }}
        >
          {menuResume?.isDefault ? (
            <StarIcon fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <StarOutlineOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          )}
          Set as default
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!menuResume) return;
            setRenameResumeId(menuResume.id);
            setRenameLabel(menuResume.label);
            setRenameOpen(true);
            closeMenu();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (!menuResume) return;
            setDeleteResumeId(menuResume.id);
            setDeleteOpen(true);
            closeMenu();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename resume</DialogTitle>
        <DialogContent>
          <TextField
            label="Label"
            value={renameLabel}
            onChange={(e) => setRenameLabel(e.target.value)}
            fullWidth
            autoFocus
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!renameResume || renameLabel.trim() === "" || isPending}
            onClick={() => {
              if (!renameResume) return;
              runAction(() => renameResumeAction(renameResume.id, renameLabel));
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete resume?</DialogTitle>
        <DialogContent>
          <Typography>
            This permanently deletes &ldquo;{deleteResume?.label}&rdquo;
            {deleteResume?.kind === "UPLOADED" ? " and its uploaded file" : ""}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!deleteResume || isPending}
            onClick={() => {
              if (!deleteResume) return;
              runAction(async () => {
                const result = await deleteResumeAction(deleteResume.id);
                if (result.success && selectedId === deleteResume.id) {
                  router.push("/resume");
                }
                return result;
              });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
