"use client";

import { useActionState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  updateProfile,
  type SettingsActionState,
} from "@/app/(app)/settings/actions";

type ProfileFormProps = {
  name: string;
  email: string;
};

const initialState: SettingsActionState = {};

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <Box component="form" action={formAction}>
      <Stack spacing={2} sx={{ maxWidth: 400 }}>
        <TextField
          name="name"
          label="Display name"
          defaultValue={name}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          fullWidth
          disabled
          helperText="Email cannot be changed."
        />
        {state.error ? <Alert severity="error">{state.error}</Alert> : null}
        {state.success ? <Alert severity="success">{state.success}</Alert> : null}
        <Box>
          <Button type="submit" variant="contained" disabled={pending}>
            {pending ? "Saving…" : "Save profile"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
