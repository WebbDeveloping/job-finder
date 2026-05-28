"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import {
  RESUME_BODY_FONT_OPTIONS,
  RESUME_HEADING_FONT_OPTIONS,
} from "@/lib/resume-templates/fonts";
import {
  getResolvedSupportedOptions,
  getTemplate,
} from "@/lib/resume-templates/registry";
import {
  FONT_SIZE_PRESETS,
  SECTION_LABELS,
  fontSizeToPreset,
  getResolvedTheme,
  type FontSizePreset,
  type ResumeSectionId,
  type ResumeTheme,
} from "@/lib/resume-templates/theme";

type ResumeDesignPanelProps = {
  templateId: string;
  theme: ResumeTheme | null;
  onChange: (theme: ResumeTheme | null) => void;
  disabled?: boolean;
};

type ColorKey = "primaryColor" | "headingColor" | "textColor" | "mutedColor";

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: "primaryColor", label: "Accent / links" },
  { key: "headingColor", label: "Headings" },
  { key: "textColor", label: "Body text" },
  { key: "mutedColor", label: "Muted text" },
];

function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function ColorField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const pickerValue = isHexColor(value) ? value : "#000000";

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Box
        component="input"
        type="color"
        value={pickerValue}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} color picker`}
        sx={{
          width: 40,
          height: 40,
          p: 0,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          bgcolor: "background.paper",
        }}
      />
      <TextField
        label={label}
        size="small"
        fullWidth
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{ htmlInput: { spellCheck: false } }}
      />
    </Stack>
  );
}

export function ResumeDesignPanel({
  templateId,
  theme,
  onChange,
  disabled = false,
}: ResumeDesignPanelProps) {
  const template = getTemplate(templateId);
  const supported = getResolvedSupportedOptions(template);
  const resolved = getResolvedTheme(template.defaultTheme, theme);

  function patchTheme(updates: Partial<ResumeTheme>) {
    onChange({ ...(theme ?? {}), ...updates });
  }

  function patchColor(key: ColorKey, value: string) {
    if (!isHexColor(value)) return;
    patchTheme({ [key]: value });
  }

  function setSectionOrder(order: ResumeSectionId[]) {
    patchTheme({ sectionOrder: order });
  }

  function toggleSectionHidden(sectionId: ResumeSectionId, hidden: boolean) {
    const current = new Set(resolved.hiddenSections);
    if (hidden) {
      current.add(sectionId);
    } else {
      current.delete(sectionId);
    }
    patchTheme({ hiddenSections: [...current] });
  }

  function moveSection(sectionId: ResumeSectionId, direction: -1 | 1) {
    const order = [...resolved.sectionOrder];
    const index = order.indexOf(sectionId);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    setSectionOrder(order);
  }

  const fontSizePreset = fontSizeToPreset(resolved.fontSize);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Typography variant="body2" color="text.secondary">
          Customize colors, fonts, layout, and which sections appear in your PDF.
        </Typography>
        <Button
          type="button"
          size="small"
          variant="outlined"
          disabled={disabled || theme === null}
          onClick={() => onChange(null)}
        >
          Reset to template defaults
        </Button>
      </Stack>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Colors
        </Typography>
        <Stack spacing={2}>
          {COLOR_FIELDS.map(({ key, label }) => (
            <ColorField
              key={key}
              label={label}
              value={resolved[key]}
              disabled={disabled}
              onChange={(value) => patchColor(key, value)}
            />
          ))}
        </Stack>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth size="small" disabled={disabled}>
          <InputLabel id="heading-font-label">Heading font</InputLabel>
          <Select
            labelId="heading-font-label"
            label="Heading font"
            value={resolved.headingFont}
            onChange={(e) => patchTheme({ headingFont: e.target.value })}
          >
            {RESUME_HEADING_FONT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" disabled={disabled}>
          <InputLabel id="body-font-label">Body font</InputLabel>
          <Select
            labelId="body-font-label"
            label="Body font"
            value={resolved.bodyFont}
            onChange={(e) => patchTheme({ bodyFont: e.target.value })}
          >
            {RESUME_BODY_FONT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

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

      {supported.pageMargin ? (
        <FormControl component="fieldset" disabled={disabled}>
          <FormLabel component="legend">Page margins</FormLabel>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={resolved.pageMargin}
            onChange={(_e, value: ResumeTheme["pageMargin"] | null) => {
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
      ) : null}

      {supported.sidebarWidth ? (
        <FormControl component="fieldset" disabled={disabled}>
          <FormLabel component="legend">Sidebar width</FormLabel>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={resolved.sidebarWidth}
            onChange={(_e, value: ResumeTheme["sidebarWidth"] | null) => {
              if (value) {
                patchTheme({ sidebarWidth: value });
              }
            }}
            sx={{ mt: 1 }}
          >
            <ToggleButton value="narrow">Narrow</ToggleButton>
            <ToggleButton value="normal">Normal</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      ) : null}

      {supported.sectionOrder ? (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Sections
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Reorder content sections (header is always first). Hidden sections are omitted from the PDF.
        </Typography>
        <List dense disablePadding>
          {resolved.sectionOrder.map((sectionId, index) => {
            const hidden = resolved.hiddenSections.includes(sectionId);
            return (
              <ListItem
                key={sectionId}
                disableGutters
                secondaryAction={
                  <Stack direction="row" spacing={0}>
                    <IconButton
                      size="small"
                      aria-label={`Move ${SECTION_LABELS[sectionId]} up`}
                      disabled={disabled || index === 0}
                      onClick={() => moveSection(sectionId, -1)}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Move ${SECTION_LABELS[sectionId]} down`}
                      disabled={
                        disabled || index === resolved.sectionOrder.length - 1
                      }
                      onClick={() => moveSection(sectionId, 1)}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={!hidden}
                      disabled={disabled}
                      onChange={(e) =>
                        toggleSectionHidden(sectionId, !e.target.checked)
                      }
                    />
                  }
                  label={
                    <ListItemText
                      primary={SECTION_LABELS[sectionId]}
                      secondary={hidden ? "Hidden in PDF" : undefined}
                    />
                  }
                  sx={{ m: 0, flex: 1 }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      ) : null}
    </Stack>
  );
}
