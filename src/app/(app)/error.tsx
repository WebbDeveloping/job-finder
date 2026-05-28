"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormColumn } from "@/components/ui/FormColumn";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: ErrorPageProps) {
  return (
    <FormColumn>
      <Stack spacing={3}>
        <Typography variant="appPageTitle" component="h1">
          Something went wrong
        </Typography>
        <Alert severity="error">
          {error.message || "An unexpected error occurred. Please try again."}
        </Alert>
        <Button variant="contained" onClick={reset} sx={{ alignSelf: "flex-start" }}>
          Try again
        </Button>
      </Stack>
    </FormColumn>
  );
}
