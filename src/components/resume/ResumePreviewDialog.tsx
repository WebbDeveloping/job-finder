"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ResumeLibraryItem } from "@/lib/resume-types";
import { getResumeFileApiUrl, resumeKindHint } from "@/lib/resume-types";

type ResumePreviewDialogProps = {
  resume: ResumeLibraryItem | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (resumeId: string) => void;
};

export function ResumePreviewDialog({
  resume,
  open,
  onClose,
  onEdit,
}: ResumePreviewDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const resumeId = resume?.id ?? "";
  const resumeKind = resume?.kind ?? "";

  useEffect(() => {
    if (!open || !resumeId || !resumeKind) {
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    setLoading(true);
    setError(null);
    setPreviewUrl(null);

    fetch(getResumeFileApiUrl(resumeId, resumeKind))
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Could not load preview.");
        }
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load preview.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, resumeId, resumeKind]);

  async function handleDownload() {
    if (!resume || !previewUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(getResumeFileApiUrl(resume.id, resume.kind));
      if (!response.ok) {
        throw new Error("Download failed.");
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        {resume?.label ?? "Resume preview"}
        {resume ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {resumeKindHint(resume.kind)}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{
            height: { xs: "60vh", sm: "70vh" },
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <CircularProgress aria-label="Loading preview" />
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : previewUrl ? (
            <Box
              component="iframe"
              src={previewUrl}
              title={resume ? `Preview: ${resume.label}` : "Resume preview"}
              sx={{
                width: "100%",
                height: "100%",
                border: 0,
                bgcolor: "background.paper",
              }}
            />
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1}
          sx={{ width: "100%", justifyContent: "flex-end" }}
        >
          <Button onClick={onClose}>Close</Button>
          {resume?.kind === "BUILT" && onEdit ? (
            <Button
              variant="outlined"
              onClick={() => {
                onEdit(resume.id);
                onClose();
              }}
            >
              Edit
            </Button>
          ) : null}
          <Button
            variant="contained"
            disabled={!previewUrl || downloading}
            onClick={handleDownload}
          >
            {downloading ? "Downloading…" : "Download"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
