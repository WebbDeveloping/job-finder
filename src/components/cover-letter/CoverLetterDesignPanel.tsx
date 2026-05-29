"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { RESUME_BODY_FONT_OPTIONS } from "@/lib/resume-templates/fonts";
import {
  FONT_SIZE_PRESETS,
  fontSizeToPreset,
  type FontSizePreset,
} from "@/lib/resume-templates/theme";
import {
  getResolvedCoverLetterTheme,
  type CoverLetterTheme,
} from "@/lib/cover-letter-theme";

type CoverLetterDesignPanelProps = {
  theme: CoverLetterTheme | null;
  onChange: (theme: CoverLetterTheme | null) => void;
  disabled?: boolean;
};

export function CoverLetterDesignPanel({
  theme,
  onChange,
  disabled = false,
}: CoverLetterDesignPanelProps) {
  const resolved = getResolvedCoverLetterTheme(theme);
  const fontSizePreset = fontSizeToPreset(resolved.fontSize);

  function patchTheme(updates: Partial<CoverLetterTheme>) {
    onChange({ ...(theme ?? {}), ...updates });
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Typography variant="body2" color="text.secondary">
          Customize fonts and page margins for your PDF.
        </Typography>
        <Button
          type="button"
          size="small"
          variant="outlined"
          disabled={disabled || theme === null}
          onClick={() => onChange(null)}
        >
          Reset to defaults
        </Button>
      </Stack>

      <FormControl fullWidth size="small" disabled={disabled}>
        <InputLabel id="cover-letter-font-label">Font family</InputLabel>
        <Select
          labelId="cover-letter-font-label"
          label="Font family"
          value={resolved.bodyFont}
          onChange={(event) => patchTheme({ bodyFont: event.target.value })}
        >
          {RESUME_BODY_FONT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset" disabled={disabled}>
        <FormLabel component="legend">Text size</FormLabel>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={fontSizePreset}
          onChange={(_e, value: FontSizePreset | null) => {
            if (value) {
              patchTheme({ fontSize: FONT_SIZE_PRESETS[value] });
            }
          }}
          sx={{ mt: 1 }}
        >
          <ToggleButton value="small">S</ToggleButton>
          <ToggleButton value="medium">M</ToggleButton>
          <ToggleButton value="large">L</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl component="fieldset" disabled={disabled}>
        <FormLabel component="legend">Page margins</FormLabel>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={resolved.pageMargin}
          onChange={(_e, value: CoverLetterTheme["pageMargin"] | null) => {
            if (value) {
              patchTheme({ pageMargin: value });
            }
          }}
          sx={{ mt: 1 }}
        >
          <ToggleButton value="compact">Compact</ToggleButton>
          <ToggleButton value="normal">Normal</ToggleButton>
          <ToggleButton value="relaxed">Relaxed</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </Stack>
  );
}
