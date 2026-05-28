"use client";

import { useState, useTransition } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteApplication } from "@/app/(app)/pipeline/actions";

type DeleteApplicationButtonProps = {
  applicationId: string;
  company: string;
  role: string;
};

export function DeleteApplicationButton({
  applicationId,
  company,
  role,
}: DeleteApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setError(null);
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteApplication(applicationId);
      } catch {
        setError("Could not delete application. Please try again.");
      }
    });
  }

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
        Delete application
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete application?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: error ? 2 : 0 }}>
            This permanently deletes your application to{" "}
            <strong>
              {role} at {company}
            </strong>{" "}
            and its stage history. This cannot be undone.
          </DialogContentText>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
