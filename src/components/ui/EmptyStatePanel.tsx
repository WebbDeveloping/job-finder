import type { ReactNode } from "react";
import { AppCard } from "@/components/ui/AppCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { appTokens } from "@/theme/tokens";

type EmptyStatePanelProps = {
  illustrationSrc: string;
  title: string;
  description: string;
  action?: ReactNode;
  marginTop?: boolean;
};

export function EmptyStatePanel({
  illustrationSrc,
  title,
  description,
  action,
  marginTop = true,
}: EmptyStatePanelProps) {
  return (
    <AppCard
      padding="empty"
      dashed
      sx={marginTop ? { mt: appTokens.emptyStateMarginTop } : undefined}
    >
      <EmptyState
        illustrationSrc={illustrationSrc}
        title={title}
        description={description}
        action={action}
      />
    </AppCard>
  );
}
