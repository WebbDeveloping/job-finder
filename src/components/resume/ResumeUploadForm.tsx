"use client";

import { useActionState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  uploadResume,
  type ResumeActionState,
} from "@/app/(app)/resume/actions";

const initialState: ResumeActionState = {};

export function ResumeUploadForm() {
  const [state, formAction, pending] = useActionState(uploadResume, initialState);

  return (
    <Stack component="form" action={formAction} spacing={2} sx={{ maxWidth: 560 }}>
      <Typography variant="body2" color="text.secondary">
        PDF only, up to 5 MB. Files are stored privately and downloaded through your
        account.
      </Typography>
      <TextField
        name="label"
        label="Display name"
        fullWidth
        placeholder="e.g. Staff engineer 2024"
        helperText="Optional - defaults to the file name"
      />
      <Button variant="outlined" component="label" disabled={pending}>
        Choose PDF
        <input type="file" name="file" accept="application/pdf" hidden required />
      </Button>
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? <Alert severity="success">Resume uploaded.</Alert> : null}
      <Button type="submit" variant="contained" disabled={pending}>
        {pending ? "Uploading..." : "Upload Resume"}
      </Button>
    </Stack>
  );
}
