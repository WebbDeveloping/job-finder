import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { appTokens } from "@/theme/tokens";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel,
  actions,
}: PageHeaderProps) {
  return (
    <Stack spacing={backHref ? 1 : 0} sx={{ mb: appTokens.pageHeaderGap }}>
      {backHref ? (
        <BackLink href={backHref} label={backLabel ?? "Back"} />
      ) : null}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "flex-start" }, justifyContent: "space-between" }}
      >
        <Stack spacing={0.5}>
          <Typography variant="appPageTitle" component="h1">
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        {actions ? <Stack direction="row" spacing={1}>{actions}</Stack> : null}
      </Stack>
    </Stack>
  );
}
