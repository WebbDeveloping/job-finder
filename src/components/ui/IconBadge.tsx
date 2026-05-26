"use client";

import type { ReactElement } from "react";
import Box from "@mui/material/Box";
import type { SvgIconProps } from "@mui/material/SvgIcon";

type IconBadgeProps = {
  icon: ReactElement<SvgIconProps>;
  size?: number;
};

export function IconBadge({ icon, size = 48 }: IconBadgeProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        opacity: 0.92,
        "& .MuiSvgIcon-root": { fontSize: size * 0.5 },
      }}
    >
      {icon}
    </Box>
  );
}
