/** Layout and surface tokens — import in components, not CSS. */

export const marketingTokens = {
  sectionPy: {
    default: { xs: 5, md: 8 },
    hero: { xs: 6, md: 10 },
    compact: { xs: 4, md: 6 },
    spacious: { xs: 4, md: 8, lg: 10 },
  },
  leadMaxWidth: 560,
  containerNarrow: "md" as const,
} as const;

export const appTokens = {
  drawerWidth: 240,
  mainPadding: { xs: 2, md: 3 },
  formMaxWidth: 480,
  formWideMaxWidth: 560,
  errorMaxWidth: 480,
  sectionGap: 4,
  sectionGapLarge: 6,
  pageHeaderGap: 3,
  quickActionsGap: 1,
  paperPadding: {
    card: 3,
    toolbar: 2,
    listItem: 2,
    empty: { py: 6, px: 3 },
  },
  emptyStateMarginTop: 6,
} as const;

/** Palette-derived tint and gradient helpers — use var(--mui-palette-*) only. */
export const surfaceTints = {
  primarySubtle:
    "color-mix(in srgb, var(--mui-palette-primary-main) 12%, var(--mui-palette-background-paper))",
  primarySoft:
    "color-mix(in srgb, var(--mui-palette-primary-main) 16%, var(--mui-palette-background-paper))",
  heroGradient:
    "linear-gradient(180deg, color-mix(in srgb, var(--mui-palette-primary-main) 8%, transparent) 0%, transparent 70%)",
  featureRadialPrimary: (opacity = 28) =>
    `radial-gradient(ellipse 70% 80% at 30% 50%, color-mix(in srgb, var(--mui-palette-primary-main) ${opacity}%, transparent), transparent 70%)`,
  featureRadialInfo: (opacity = 22) =>
    `radial-gradient(ellipse 75% 75% at 70% 40%, color-mix(in srgb, var(--mui-palette-info-main) ${opacity}%, transparent), transparent 72%)`,
  darkSurface:
    "color-mix(in srgb, var(--mui-palette-common-white) 2%, transparent)",
} as const;
