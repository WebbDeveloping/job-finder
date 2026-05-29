"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { downloadCoverLetterPdf } from "@/lib/cover-letter-download";

type CoverLetterDownloadButtonProps = {
  coverLetterId: string | null;
  coverLetterLabel?: string | null;
  disabled?: boolean;
};

export function CoverLetterDownloadButton({
  coverLetterId,
  coverLetterLabel = null,
  disabled = false,
}: CoverLetterDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDownload = coverLetterId !== null && !disabled;

  async function handleDownload() {
    if (!coverLetterId) return;

    setError(null);
    setDownloading(true);

    try {
      await downloadCoverLetterPdf(
        coverLetterId,
        coverLetterLabel ?? undefined,
      );
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
        disabled={!canDownload || downloading}
        onClick={handleDownload}
      >
        {downloading ? "Downloading…" : "Download PDF"}
      </Button>
      {!canDownload && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: { xs: "left", sm: "right" } }}
        >
          No cover letter linked.
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
