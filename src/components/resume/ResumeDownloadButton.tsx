"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ResumeDownloadButtonProps = {
  resumeId: string | null;
  kind: "BUILT" | "UPLOADED" | null;
  disabled?: boolean;
};

export function ResumeDownloadButton({
  resumeId,
  kind,
  disabled = false,
}: ResumeDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDownload = resumeId !== null && kind !== null && !disabled;

  async function handleDownload() {
    if (!resumeId || !kind) return;

    setError(null);
    setDownloading(true);

    try {
      const url =
        kind === "BUILT"
          ? `/api/resume/pdf?resumeId=${encodeURIComponent(resumeId)}`
          : `/api/resume/file/${encodeURIComponent(resumeId)}`;

      const response = await fetch(url);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Download failed.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] ?? "resume.pdf";

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
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
        {downloading ? "Downloading…" : "Download"}
      </Button>
      {!canDownload && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: { xs: "left", sm: "right" } }}
        >
          Select a resume to download.
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
