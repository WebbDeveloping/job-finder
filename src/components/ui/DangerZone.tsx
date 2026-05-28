import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { AppCard } from "@/components/ui/AppCard";
import { appTokens } from "@/theme/tokens";

type DangerZoneProps = {
  title?: string;
  description: string;
  action: ReactNode;
};

export function DangerZone({
  title = "Danger zone",
  description,
  action,
}: DangerZoneProps) {
  return (
    <AppCard padding="card" sx={{ mt: appTokens.sectionGapLarge }}>
      <Stack spacing={2}>
        <Typography variant="appSectionTitle" component="h2" color="error">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {action}
      </Stack>
    </AppCard>
  );
}
