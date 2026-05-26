"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ResumeDownloadButtonProps = {
  hasSavedProfile: boolean;
};

export function ResumeDownloadButton({
  hasSavedProfile,
}: ResumeDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);
    setDownloading(true);

    try {
      const response = await fetch("/api/resume/pdf");
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Download failed.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? "Resume.pdf";

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Stack
      spacing={1}
      sx={{ alignItems: { xs: "stretch", sm: "flex-end" } }}
    >
      <Button
        variant="outlined"
        disabled={!hasSavedProfile || downloading}
        onClick={handleDownload}
      >
        {downloading ? "Generating…" : "Download PDF"}
      </Button>
      {!hasSavedProfile && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: { xs: "left", sm: "right" } }}
        >
          Save your resume to enable download.
        </Typography>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}
