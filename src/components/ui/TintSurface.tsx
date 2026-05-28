import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { surfaceTints } from "@/theme/tokens";

type TintKey = "primarySubtle" | "primarySoft" | "heroGradient" | "darkSurface";

type TintSurfaceProps = {
  children: ReactNode;
  tint?: TintKey | "custom";
  background?: string;
  component?: "box" | "paper";
  sx?: SxProps<Theme>;
};

export function TintSurface({
  children,
  tint = "primarySubtle",
  background,
  component = "box",
  sx,
}: TintSurfaceProps) {
  const bgcolor =
    background ?? (tint === "custom" ? undefined : surfaceTints[tint]);

  const sharedSx: SxProps<Theme> = {
    ...(bgcolor ? { bgcolor } : {}),
    ...sx,
  };

  if (component === "paper") {
    return (
      <Paper variant="outlined" sx={sharedSx}>
        {children}
      </Paper>
    );
  }

  return <Box sx={sharedSx}>{children}</Box>;
}
