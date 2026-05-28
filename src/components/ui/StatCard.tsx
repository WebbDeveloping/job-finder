import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactElement, ReactNode } from "react";
import { AppCard } from "@/components/ui/AppCard";
import { IconBadge } from "@/components/ui/IconBadge";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type StatCardProps = {
  icon: ReactElement<SvgIconProps>;
  label: string;
  value: ReactNode;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <AppCard padding="card">
      <Stack spacing={2}>
        <IconBadge icon={icon} size={40} />
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          {typeof value === "string" || typeof value === "number" ? (
            <Typography variant="h3" component="p">
              {value}
            </Typography>
          ) : (
            value
          )}
        </Stack>
      </Stack>
    </AppCard>
  );
}
