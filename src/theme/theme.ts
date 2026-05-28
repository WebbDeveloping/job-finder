"use client";

import { createTheme } from "@mui/material/styles";
import { components } from "@/theme/components";
import { palette as paletteOptions } from "@/theme/palette";
import { typography } from "@/theme/typography";

const theme = createTheme({
  cssVariables: true,
  palette: paletteOptions,
  typography,
  shape: {
    borderRadius: 8,
  },
  components,
});

export default theme;
