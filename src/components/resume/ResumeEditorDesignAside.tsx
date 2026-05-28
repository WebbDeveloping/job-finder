"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ResumeDesignPanel } from "@/components/resume/ResumeDesignPanel";
import type { ResumeTheme } from "@/lib/resume-templates/theme";

type ResumeEditorDesignAsideProps = {
  templateId: string;
  theme: ResumeTheme | null;
  onThemeChange: (theme: ResumeTheme | null) => void;
  onChangeTemplate: () => void;
  disabled?: boolean;
};

export function ResumeEditorDesignAside({
  templateId,
  theme,
  onThemeChange,
  onChangeTemplate,
  disabled = false,
}: ResumeEditorDesignAsideProps) {
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
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" component="h2">
            Design
          </Typography>
          <Button
            type="button"
            size="small"
            variant="outlined"
            onClick={onChangeTemplate}
            disabled={disabled}
          >
            Change template
          </Button>
        </Stack>
        <Box>
          <ResumeDesignPanel
            templateId={templateId}
            theme={theme}
            onChange={onThemeChange}
            disabled={disabled}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
