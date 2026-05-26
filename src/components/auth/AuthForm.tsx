"use client";

import { useActionState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { AuthActionState } from "@/app/(auth)/actions";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    prevState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  callbackUrl?: string;
};

const initialState: AuthActionState = {};

export function AuthForm({ mode, action, callbackUrl = "/dashboard" }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Box component="form" action={formAction} noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Stack spacing={2}>
        {mode === "signup" ? (
          <TextField
            name="name"
            label="Name (optional)"
            autoComplete="name"
            fullWidth
          />
        ) : null}
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          fullWidth
          helperText={
            mode === "signup" ? "At least 8 characters." : undefined
          }
        />
        {state.error ? (
          <Alert severity="error">{state.error}</Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={pending} fullWidth>
          {pending
            ? mode === "signup"
              ? "Creating account…"
              : "Signing in…"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </Button>
      </Stack>
    </Box>
  );
}
