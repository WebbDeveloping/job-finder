"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  uploadResume,
  type ResumeActionState,
} from "@/app/(app)/resume/actions";
const initialState: ResumeActionState = {};

type ResumeUploadDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeUploadDialog({ open, onClose }: ResumeUploadDialogProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(uploadResume, initialState);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  function handleClose() {
    if (pending) return;
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload PDF resume</DialogTitle>
      <form action={formAction}>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              PDF only, up to 5 MB. Files are stored privately and downloaded
              through your account.
            </Typography>
            <TextField
              name="label"
              label="Display name"
              fullWidth
              placeholder="e.g. Staff engineer 2024"
              helperText="Optional — defaults to the file name"
            />
            <Button variant="outlined" component="label" disabled={pending}>
              {fileName ?? "Choose PDF"}
              <input
                type="file"
                name="file"
                accept="application/pdf"
                hidden
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFileName(file?.name ?? null);
                }}
              />
            </Button>
            {state.error ? <Alert severity="error">{state.error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
