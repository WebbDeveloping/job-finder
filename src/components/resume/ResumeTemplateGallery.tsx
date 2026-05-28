"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import {
  RESUME_TEMPLATE_CATEGORIES,
  RESUME_TEMPLATE_LIST,
  type ResumeTemplateCategory,
  type ResumeTemplateDefinition,
} from "@/lib/resume-templates/registry";

type ResumeTemplateGalleryProps = {
  value: string;
  onChange: (templateId: string) => void;
  disabled?: boolean;
  /** When set, changing template calls this instead of onChange directly (e.g. confirm dialog). */
  onRequestChange?: (templateId: string) => void;
};

function TemplateCard({
  template,
  selected,
  onSelect,
  disabled,
}: {
  template: ResumeTemplateDefinition;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        variant="outlined"
        sx={{
          borderColor: selected ? "primary.main" : "divider",
          borderWidth: selected ? 2 : 1,
          position: "relative",
          height: "100%",
        }}
      >
        <CardActionArea
          onClick={onSelect}
          disabled={disabled}
          aria-pressed={selected}
          aria-label={`${template.label} template${selected ? ", selected" : ""}`}
          role="radio"
          sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
        >
          <CardMedia
            component="img"
            height={180}
            image={template.thumbnailSrc}
            alt={template.thumbnailAlt}
            sx={{
              objectFit: "cover",
              objectPosition: "top",
              bgcolor: "grey.100",
            }}
          />
          <CardContent sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.5 }}
            >
              <Typography variant="subtitle1" component="h3">
                {template.label}
              </Typography>
              {template.isPopular ? (
                <Chip label="Popular" size="small" color="primary" />
              ) : null}
              <Chip label={template.category} size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {template.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        {selected ? (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "primary.main",
              bgcolor: "background.paper",
              borderRadius: "50%",
              display: "flex",
            }}
          >
            <CheckCircleIcon aria-hidden />
          </Box>
        ) : null}
      </Card>
    </Grid>
  );
}

export function ResumeTemplateGallery({
  value,
  onChange,
  disabled = false,
  onRequestChange,
}: ResumeTemplateGalleryProps) {
  const [categoryFilter, setCategoryFilter] = useState<
    ResumeTemplateCategory | "all"
  >("all");

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === "all") {
      return RESUME_TEMPLATE_LIST;
    }
    return RESUME_TEMPLATE_LIST.filter((t) => t.category === categoryFilter);
  }, [categoryFilter]);

  function handleSelect(templateId: string) {
    if (templateId === value) return;
    if (onRequestChange) {
      onRequestChange(templateId);
    } else {
      onChange(templateId);
    }
  }

  return (
    <Box role="radiogroup" aria-label="Resume template">
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          label="All"
          size="small"
          variant={categoryFilter === "all" ? "filled" : "outlined"}
          color={categoryFilter === "all" ? "primary" : "default"}
          onClick={() => setCategoryFilter("all")}
          disabled={disabled}
        />
        {RESUME_TEMPLATE_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={category}
            size="small"
            variant={categoryFilter === category ? "filled" : "outlined"}
            color={categoryFilter === category ? "primary" : "default"}
            onClick={() => setCategoryFilter(category)}
            disabled={disabled}
          />
        ))}
      </Stack>
      <Grid container spacing={2}>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={value === template.id}
            onSelect={() => handleSelect(template.id)}
            disabled={disabled}
          />
        ))}
      </Grid>
      {filteredTemplates.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No templates in this category.
        </Typography>
      ) : null}
    </Box>
  );
}
