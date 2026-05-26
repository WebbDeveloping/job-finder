"use client";

import { useActionState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { ActionState } from "@/app/pipeline/actions";
import {
  createApplication,
  updateApplication,
} from "@/app/pipeline/actions";

type ApplicationFormProps = {
  mode: "create" | "edit";
  applicationId?: string;
  defaultValues?: {
    company: string;
    role: string;
    source: string;
    notes: string;
  };
};

const initialState: ActionState = {};

export function ApplicationForm({
  mode,
  applicationId,
  defaultValues,
}: ApplicationFormProps) {
  const action =
    mode === "create"
      ? createApplication
      : updateApplication.bind(null, applicationId!);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Stack component="form" action={formAction} spacing={2.5}>
      <TextField
        id="company"
        name="company"
        label="Company"
        required
        fullWidth
        defaultValue={defaultValues?.company ?? ""}
      />

      <TextField
        id="role"
        name="role"
        label="Role"
        required
        fullWidth
        defaultValue={defaultValues?.role ?? ""}
      />

      <TextField
        id="source"
        name="source"
        label="Source"
        fullWidth
        placeholder="LinkedIn, referral, etc."
        defaultValue={defaultValues?.source ?? ""}
      />

      <TextField
        id="notes"
        name="notes"
        label="Notes"
        fullWidth
        multiline
        minRows={4}
        defaultValue={defaultValues?.notes ?? ""}
      />

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <Button type="submit" variant="contained" disabled={pending}>
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create application"
            : "Save changes"}
      </Button>
    </Stack>
  );
}
