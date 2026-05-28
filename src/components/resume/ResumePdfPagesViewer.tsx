"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type ResumePdfPagesViewerProps = {
  fileUrl: string;
};

const PAGE_GAP_PX = 16;
const PAGE_HORIZONTAL_PADDING_PX = 24;

export function ResumePdfPagesViewer({ fileUrl }: ResumePdfPagesViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    function updateWidth() {
      const element = containerRef.current;
      if (!element) return;
      setContainerWidth(Math.max(0, element.clientWidth));
    }

    const element = containerRef.current;
    if (!element) return;

    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const pageWidth = useMemo(() => {
    if (containerWidth === 0) return 0;
    return Math.max(280, containerWidth - PAGE_HORIZONTAL_PADDING_PX * 2);
  }, [containerWidth]);

  function handleLoadSuccess(document: PDFDocumentProxy) {
    setNumPages(document.numPages);
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "grey.200",
        p: 2,
      }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={handleLoadSuccess}
        loading={
          <Box
            sx={{
              minHeight: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress aria-label="Loading PDF preview" />
          </Box>
        }
        error={
          <Alert severity="error">
            Could not render this preview. Try downloading the PDF.
          </Alert>
        }
        noData={<Alert severity="info">No PDF selected for preview.</Alert>}
      >
        {Array.from({ length: numPages }, (_, pageIndex) => (
          <Box
            key={`page-${pageIndex + 1}`}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: pageIndex < numPages - 1 ? `${PAGE_GAP_PX}px` : 0,
            }}
          >
            <Page
              pageNumber={pageIndex + 1}
              width={pageWidth || undefined}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Box>
        ))}
      </Document>
    </Box>
  );
}
