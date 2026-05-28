"use client";

import { useState, useTransition } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { deleteAccount } from "@/app/(app)/profile/actions";

const CONFIRM_TEXT = "DELETE";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canDelete = confirmValue === CONFIRM_TEXT;

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setConfirmValue("");
    setError(null);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteAccount();
      } catch {
        setError("Could not delete account. Please try again.");
      }
    });
  }

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              This permanently deletes your account, all job applications, stage
              history, resume library entries, and uploaded files. This cannot be
              undone.
            </DialogContentText>
            <TextField
              label={`Type ${CONFIRM_TEXT} to confirm`}
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
              fullWidth
              autoComplete="off"
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!canDelete || isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting…" : "Delete my account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
