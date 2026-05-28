import type { TypographyVariantsOptions } from "@mui/material/styles";

const fontFamily = "var(--font-geist-sans), system-ui, sans-serif";

export const typography: TypographyVariantsOptions = {
  fontFamily,
  marketingHeroTitle: {
    fontFamily,
    fontWeight: 700,
    fontSize: "3.75rem",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  marketingSectionTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "2.125rem",
    lineHeight: 1.3,
    letterSpacing: "0em",
  },
  marketingFeatureTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.3,
    letterSpacing: "0em",
  },
  marketingLead: {
    fontFamily,
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.65,
    letterSpacing: "0.00938em",
  },
  marketingStat: {
    fontFamily,
    fontWeight: 700,
    fontSize: "3rem",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  appPageTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "2.125rem",
    lineHeight: 1.235,
    letterSpacing: "0.00735em",
  },
  appSectionTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.6,
    letterSpacing: "0.0075em",
  },
  appFormGroupTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    letterSpacing: "0.00714em",
  },
  appAuthTitle: {
    fontFamily,
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.334,
    letterSpacing: "0em",
  },
};
