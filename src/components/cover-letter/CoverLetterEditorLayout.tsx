"use client";

import Box from "@mui/material/Box";
import type { ReactNode } from "react";

type CoverLetterEditorLayoutProps = {
  nav: ReactNode;
  preview: ReactNode;
  design: ReactNode;
};

export function CoverLetterEditorLayout({
  nav,
  preview,
  design,
}: CoverLetterEditorLayoutProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "320px minmax(0, 1fr) 300px",
          xl: "320px minmax(0, 1fr) minmax(0, 560px) minmax(0, 1fr) 300px",
        },
        columnGap: 3,
        rowGap: 3,
        alignItems: "flex-start",
        width: "100%",
        maxWidth: { xl: 2200 },
        mx: "auto",
      }}
    >
      <Box
        sx={{
          order: { xs: 3, lg: 1 },
          gridColumn: { lg: 1 },
          minWidth: 0,
          width: { xs: "100%", lg: 320 },
        }}
      >
        {nav}
      </Box>

      <Box
        sx={{
          order: { xs: 1, lg: 2 },
          gridColumn: { lg: 2, xl: 3 },
          minWidth: 0,
          maxWidth: { lg: 560, xl: "none" },
          position: { lg: "sticky" },
          top: { lg: 16 },
          alignSelf: "flex-start",
          width: "100%",
          justifySelf: { lg: "center" },
        }}
      >
        {preview}
      </Box>

      <Box
        sx={{
          order: { xs: 2, lg: 3 },
          gridColumn: { lg: 3, xl: 5 },
          minWidth: 0,
          width: { xs: "100%", lg: 300 },
        }}
      >
        {design}
      </Box>
    </Box>
  );
}
