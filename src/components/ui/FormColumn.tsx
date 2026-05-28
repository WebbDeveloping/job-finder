import Stack from "@mui/material/Stack";
import type { StackProps } from "@mui/material/Stack";
import type { ReactNode } from "react";
import { appTokens } from "@/theme/tokens";

type FormColumnProps = {
  children: ReactNode;
  wide?: boolean;
  spacing?: number;
  component?: StackProps["component"];
};

export function FormColumn({
  children,
  wide = false,
  spacing = 2,
  component = "div",
}: FormColumnProps) {
  return (
    <Stack
      component={component}
      spacing={spacing}
      sx={{
        maxWidth: wide ? appTokens.formWideMaxWidth : appTokens.formMaxWidth,
        width: "100%",
      }}
    >
      {children}
    </Stack>
  );
}
