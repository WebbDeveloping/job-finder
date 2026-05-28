import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  sx?: BoxProps["sx"];
};

export function SectionShell({
  children,
  id,
  "aria-labelledby": ariaLabelledBy,
  sx,
}: SectionShellProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={ariaLabelledBy}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
