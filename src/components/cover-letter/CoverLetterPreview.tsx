"use client";

import { usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { CoverLetterPdfDocument } from "@/components/cover-letter/pdf/CoverLetterPdfDocument";
import type { CoverLetterTheme } from "@/lib/cover-letter-theme";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

const LIVE_DEBOUNCE_MS = 200;
const REVOKE_DELAY_MS = 1000;

type CoverLetterPreviewProps = {
  data: CoverLetterFormData;
  theme: CoverLetterTheme | null;
};

type PreviewSnapshot = {
  data: CoverLetterFormData;
  theme: CoverLetterTheme | null;
};

const iframeSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
  bgcolor: "background.paper",
} as const;

function CrossfadePdfFrame({ src }: { src: string | null }) {
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const revokeLater = useRef<string[]>([]);

  useEffect(() => {
    if (!src) return;
    if (!activeSrc) {
      setActiveSrc(src);
      return;
    }
    const activeBase = activeSrc.split("#")[0];
    const nextBase = src.split("#")[0];
    if (activeBase === nextBase) return;
    setPendingSrc((prev) => {
      if (prev) {
        revokeLater.current.push(prev.split("#")[0]);
      }
      return src;
    });
  }, [src, activeSrc]);

  useEffect(() => {
    if (revokeLater.current.length === 0) return;
    const timer = window.setTimeout(() => {
      for (const url of revokeLater.current) {
        URL.revokeObjectURL(url);
      }
      revokeLater.current = [];
    }, REVOKE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeSrc]);

  useEffect(() => {
    return () => {
      for (const url of revokeLater.current) {
        URL.revokeObjectURL(url);
      }
      if (activeSrc) {
        URL.revokeObjectURL(activeSrc.split("#")[0]);
      }
      if (pendingSrc) {
        URL.revokeObjectURL(pendingSrc.split("#")[0]);
      }
    };
  }, [activeSrc, pendingSrc]);

  function promotePending() {
    if (!pendingSrc) return;
    setActiveSrc((prev) => {
      if (prev) {
        revokeLater.current.push(prev.split("#")[0]);
      }
      return pendingSrc;
    });
    setPendingSrc(null);
  }

  if (!activeSrc && !pendingSrc) {
    return (
      <StackPlaceholder>
        <CircularProgress size={28} />
      </StackPlaceholder>
    );
  }

  return (
    <>
      {activeSrc ? (
        <Box
          component="iframe"
          src={activeSrc}
          title="Cover letter preview"
          sx={iframeSx}
        />
      ) : null}
      {pendingSrc ? (
        <Box
          component="iframe"
          src={pendingSrc}
          title="Cover letter preview loading"
          onLoad={promotePending}
          sx={{
            ...iframeSx,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </>
  );
}

function StablePdfIframe({
  data,
  theme,
  height,
}: {
  data: CoverLetterFormData;
  theme: CoverLetterTheme | null;
  height: Record<string, unknown>;
}) {
  const [debounced, setDebounced] = useState<PreviewSnapshot>({ data, theme });
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [pdfState, updatePdf] = usePDF();

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebounced({ data, theme }),
      LIVE_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [data, theme]);

  const document = useMemo(
    () => (
      <CoverLetterPdfDocument data={debounced.data} theme={debounced.theme} />
    ),
    [debounced],
  );

  useEffect(() => {
    updatePdf(document);
  }, [document, updatePdf]);

  useEffect(() => {
    if (!pdfState.blob || pdfState.loading) return;

    const objectUrl = URL.createObjectURL(pdfState.blob);
    setReadySrc(`${objectUrl}#toolbar=0`);
  }, [pdfState.blob, pdfState.loading]);

  return (
    <Box
      sx={{
        ...height,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "grey.100",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <CrossfadePdfFrame src={readySrc} />
      </Box>
      {pdfState.loading && readySrc ? (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Updating…
          </Typography>
        </Box>
      ) : null}
      {pdfState.error ? (
        <Alert severity="error" sx={{ m: 1 }}>
          {String(pdfState.error)}
        </Alert>
      ) : null}
    </Box>
  );
}

function StackPlaceholder({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}

export function CoverLetterPreview({ data, theme }: CoverLetterPreviewProps) {
  const embeddedHeight = {
    height: { xs: 260, lg: "calc(100vh - 180px)" },
    minHeight: { lg: 480 },
  };

  return (
    <Box sx={{ width: "100%" }}>
      <StablePdfIframe data={data} theme={theme} height={embeddedHeight} />
    </Box>
  );
}
