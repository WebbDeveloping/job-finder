import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { marketingTokens } from "@/theme/tokens";

type SectionHeaderMode = "marketing" | "app";

type SectionHeaderProps = {
  mode?: SectionHeaderMode;
  eyebrow?: string;
  title: string;
  titleId?: string;
  titleComponent?: "h1" | "h2" | "h3";
  lead?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

const titleVariants = {
  marketing: {
    h1: "marketingHeroTitle" as const,
    h2: "marketingSectionTitle" as const,
    h3: "marketingFeatureTitle" as const,
  },
  app: {
    h1: "appPageTitle" as const,
    h2: "appSectionTitle" as const,
    h3: "appFormGroupTitle" as const,
  },
};

export function SectionHeader({
  mode = "marketing",
  eyebrow,
  title,
  titleId,
  titleComponent = "h2",
  lead,
  align = "left",
  action,
}: SectionHeaderProps) {
  const titleVariant = titleVariants[mode][titleComponent];

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        mb: action ? 0 : undefined,
      }}
    >
      {eyebrow ? (
        <Typography variant="overline" color="text.secondary">
          {eyebrow}
        </Typography>
      ) : null}
      <Stack
        direction={{ xs: "column", sm: action ? "row" : "column" }}
        spacing={2}
        sx={{
          width: "100%",
          alignItems: align === "center" ? "center" : "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Typography
          id={titleId}
          variant={titleVariant}
          component={titleComponent}
        >
          {title}
        </Typography>
        {action}
      </Stack>
      {lead ? (
        <Typography
          variant={mode === "marketing" ? "marketingLead" : "body2"}
          color={mode === "marketing" ? undefined : "text.secondary"}
          sx={
            mode === "marketing"
              ? { color: "text.secondary", maxWidth: marketingTokens.leadMaxWidth }
              : { maxWidth: marketingTokens.leadMaxWidth }
          }
        >
          {lead}
        </Typography>
      ) : null}
    </Stack>
  );
}
