"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";

type ResumeEditorLayoutProps = {
  nav: ReactNode;
  preview: ReactNode;
  design: ReactNode;
};

export function ResumeEditorLayout({
  nav,
  preview,
  design,
}: ResumeEditorLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 3,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Box
        sx={{
          order: { xs: 3, lg: 1 },
          width: { lg: 320 },
          flexShrink: 0,
          minWidth: 0,
          flexGrow: { xs: 1, lg: 0 },
        }}
      >
        {nav}
      </Box>

      <Box
        sx={{
          order: { xs: 1, lg: 2 },
          flex: 1,
          minWidth: 0,
          maxWidth: { lg: 560 },
          position: { lg: "sticky" },
          top: { lg: 16 },
          alignSelf: "flex-start",
          width: "100%",
        }}
      >
        {preview}
      </Box>

      <Box
        sx={{
          order: { xs: 2, lg: 3 },
          width: { xs: "100%", lg: 300 },
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        {design}
      </Box>
    </Box>
  );
}
