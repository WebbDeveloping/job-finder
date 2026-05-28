import type { Components, Theme } from "@mui/material/styles";

export const components: Components<Omit<Theme, "components">> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
      variant: "outlined",
    },
  },
  MuiContainer: {
    defaultProps: {
      maxWidth: "lg",
    },
  },
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        marketingHeroTitle: "h1",
        marketingSectionTitle: "h2",
        marketingFeatureTitle: "h3",
        marketingLead: "p",
        marketingStat: "p",
        appPageTitle: "h1",
        appSectionTitle: "h2",
        appFormGroupTitle: "h3",
        appAuthTitle: "h1",
      },
    },
  },
};
