"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CoverLetterDesignPanel } from "@/components/cover-letter/CoverLetterDesignPanel";
import type { CoverLetterTheme } from "@/lib/cover-letter-theme";

type CoverLetterEditorDesignAsideProps = {
  theme: CoverLetterTheme | null;
  onThemeChange: (theme: CoverLetterTheme | null) => void;
  disabled?: boolean;
};

export function CoverLetterEditorDesignAside({
  theme,
  onThemeChange,
  disabled = false,
}: CoverLetterEditorDesignAsideProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: "background.paper",
        position: { lg: "sticky" },
        top: { lg: 16 },
        maxHeight: { lg: "calc(100vh - 96px)" },
        overflow: { lg: "auto" },
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" component="h2">
          Design
        </Typography>
        <Box>
          <CoverLetterDesignPanel
            theme={theme}
            onChange={onThemeChange}
            disabled={disabled}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
