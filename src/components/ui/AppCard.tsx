import Paper from "@mui/material/Paper";
import type { PaperProps } from "@mui/material/Paper";
import type { ReactNode } from "react";
import { appTokens } from "@/theme/tokens";

type AppCardPadding = "card" | "toolbar" | "listItem" | "empty" | "none";

type AppCardProps = {
  children: ReactNode;
  padding?: AppCardPadding;
  dashed?: boolean;
  sx?: PaperProps["sx"];
};

const paddingMap: Record<Exclude<AppCardPadding, "none">, number | { py: number; px: number }> = {
  card: appTokens.paperPadding.card,
  toolbar: appTokens.paperPadding.toolbar,
  listItem: appTokens.paperPadding.listItem,
  empty: appTokens.paperPadding.empty,
};

export function AppCard({
  children,
  padding = "card",
  dashed = false,
  sx,
}: AppCardProps) {
  const p = padding === "none" ? undefined : paddingMap[padding];

  return (
    <Paper
      variant="outlined"
      sx={{
        p,
        ...(dashed ? { borderStyle: "dashed" } : {}),
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
