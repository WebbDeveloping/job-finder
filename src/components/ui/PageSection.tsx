import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { appTokens } from "@/theme/tokens";

type PageSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  gap?: "default" | "large";
};

export function PageSection({
  title,
  description,
  children,
  gap = "default",
}: PageSectionProps) {
  const marginTop = gap === "large" ? appTokens.sectionGapLarge : appTokens.sectionGap;

  return (
    <Stack spacing={2} sx={{ mt: marginTop }}>
      {title ? (
        <Typography variant="appSectionTitle" component="h2">
          {title}
        </Typography>
      ) : null}
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
      {children}
    </Stack>
  );
}
