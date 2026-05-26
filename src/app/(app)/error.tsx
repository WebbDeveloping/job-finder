"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: ErrorPageProps) {
  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Something went wrong
      </Typography>
      <Alert severity="error" sx={{ mb: 3 }}>
        {error.message || "An unexpected error occurred. Please try again."}
      </Alert>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Box>
  );
}
