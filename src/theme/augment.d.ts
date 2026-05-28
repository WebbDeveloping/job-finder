import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    app?: string;
    dark?: string;
    darkAccent?: string;
  }

  interface TypographyVariants {
    marketingHeroTitle: React.CSSProperties;
    marketingSectionTitle: React.CSSProperties;
    marketingFeatureTitle: React.CSSProperties;
    marketingLead: React.CSSProperties;
    marketingStat: React.CSSProperties;
    appPageTitle: React.CSSProperties;
    appSectionTitle: React.CSSProperties;
    appFormGroupTitle: React.CSSProperties;
    appAuthTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    marketingHeroTitle?: React.CSSProperties;
    marketingSectionTitle?: React.CSSProperties;
    marketingFeatureTitle?: React.CSSProperties;
    marketingLead?: React.CSSProperties;
    marketingStat?: React.CSSProperties;
    appPageTitle?: React.CSSProperties;
    appSectionTitle?: React.CSSProperties;
    appFormGroupTitle?: React.CSSProperties;
    appAuthTitle?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    marketingHeroTitle: true;
    marketingSectionTitle: true;
    marketingFeatureTitle: true;
    marketingLead: true;
    marketingStat: true;
    appPageTitle: true;
    appSectionTitle: true;
    appFormGroupTitle: true;
    appAuthTitle: true;
  }
}
