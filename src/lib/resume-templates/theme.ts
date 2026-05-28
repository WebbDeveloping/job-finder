import { StyleSheet } from "@react-pdf/renderer";
import { ALLOWED_RESUME_FONTS_SET } from "@/lib/resume-templates/fonts";

export type ResumeSectionId =
  | "summary"
  | "skills"
  | "experience"
  | "education";

export type SidebarWidth = "narrow" | "normal";

export type ResumeTheme = {
  primaryColor?: string;
  headingColor?: string;
  textColor?: string;
  mutedColor?: string;
  headingFont?: string;
  bodyFont?: string;
  fontSize?: number;
  pageMargin?: "compact" | "normal" | "relaxed";
  sidebarWidth?: SidebarWidth;
  sectionOrder?: ResumeSectionId[];
  hiddenSections?: ResumeSectionId[];
};

export type ResumeDesign = {
  templateId: string;
  theme: ResumeTheme | null;
};

const SECTION_IDS: ResumeSectionId[] = [
  "summary",
  "skills",
  "experience",
  "education",
];

const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [...SECTION_IDS];

export const SECTION_LABELS: Record<ResumeSectionId, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
};

export const FONT_SIZE_PRESETS = {
  small: 9,
  medium: 10,
  large: 11,
} as const;

export type FontSizePreset = keyof typeof FONT_SIZE_PRESETS;

export const PAGE_MARGINS = {
  compact: { paddingTop: 28, paddingBottom: 28, paddingHorizontal: 32 },
  normal: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 40 },
  relaxed: { paddingTop: 44, paddingBottom: 44, paddingHorizontal: 48 },
} as const;

const THEME_KEYS = new Set([
  "primaryColor",
  "headingColor",
  "textColor",
  "mutedColor",
  "headingFont",
  "bodyFont",
  "fontSize",
  "pageMargin",
  "sidebarWidth",
  "sectionOrder",
  "hiddenSections",
]);

export const DEFAULT_CLASSIC_THEME: ResumeTheme = {
  primaryColor: "#1565c0",
  headingColor: "#1a1a1a",
  textColor: "#333333",
  mutedColor: "#555555",
  headingFont: "Helvetica-Bold",
  bodyFont: "Helvetica",
  fontSize: 10,
  pageMargin: "normal",
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

export const DEFAULT_SIDEBAR_THEME: ResumeTheme = {
  primaryColor: "#2e7d32",
  headingColor: "#1a1a1a",
  textColor: "#333333",
  mutedColor: "#555555",
  headingFont: "Helvetica-Bold",
  bodyFont: "Helvetica",
  fontSize: 10,
  pageMargin: "normal",
  sidebarWidth: "normal",
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

export const DEFAULT_MINIMAL_THEME: ResumeTheme = {
  primaryColor: "#424242",
  headingColor: "#1a1a1a",
  textColor: "#333333",
  mutedColor: "#666666",
  headingFont: "Helvetica-Bold",
  bodyFont: "Helvetica",
  fontSize: 10,
  pageMargin: "normal",
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

export const DEFAULT_ACCENT_BAR_THEME: ResumeTheme = {
  primaryColor: "#6a1b9a",
  headingColor: "#1a1a1a",
  textColor: "#333333",
  mutedColor: "#555555",
  headingFont: "Helvetica-Bold",
  bodyFont: "Helvetica",
  fontSize: 10,
  pageMargin: "normal",
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

export type ResolvedTheme = Required<
  Pick<
    ResumeTheme,
    | "primaryColor"
    | "headingColor"
    | "textColor"
    | "mutedColor"
    | "headingFont"
    | "bodyFont"
    | "fontSize"
    | "pageMargin"
  >
> & {
  sidebarWidth: SidebarWidth;
  sectionOrder: ResumeSectionId[];
  hiddenSections: ResumeSectionId[];
};

function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseSectionIdList(
  value: unknown,
  fieldName: string,
): ResumeSectionId[] | { error: string } {
  if (!Array.isArray(value)) {
    return { error: `${fieldName} must be an array.` };
  }

  const ids: ResumeSectionId[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !SECTION_IDS.includes(item as ResumeSectionId)) {
      return { error: `${fieldName} contains an invalid section id.` };
    }
    const id = item as ResumeSectionId;
    if (!ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids;
}

export function parseResumeTheme(
  value: unknown,
): ResumeTheme | { error: string } {
  if (value === null || value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    return { error: "Theme must be an object." };
  }

  for (const key of Object.keys(value)) {
    if (!THEME_KEYS.has(key)) {
      return { error: `Unknown theme key: ${key}.` };
    }
  }

  const theme: ResumeTheme = {};

  if (value.primaryColor !== undefined) {
    if (typeof value.primaryColor !== "string" || !isHexColor(value.primaryColor)) {
      return { error: "primaryColor must be a hex color (#RGB or #RRGGBB)." };
    }
    theme.primaryColor = value.primaryColor;
  }

  if (value.headingColor !== undefined) {
    if (typeof value.headingColor !== "string" || !isHexColor(value.headingColor)) {
      return { error: "headingColor must be a hex color (#RGB or #RRGGBB)." };
    }
    theme.headingColor = value.headingColor;
  }

  if (value.textColor !== undefined) {
    if (typeof value.textColor !== "string" || !isHexColor(value.textColor)) {
      return { error: "textColor must be a hex color (#RGB or #RRGGBB)." };
    }
    theme.textColor = value.textColor;
  }

  if (value.mutedColor !== undefined) {
    if (typeof value.mutedColor !== "string" || !isHexColor(value.mutedColor)) {
      return { error: "mutedColor must be a hex color (#RGB or #RRGGBB)." };
    }
    theme.mutedColor = value.mutedColor;
  }

  if (value.headingFont !== undefined) {
    if (
      typeof value.headingFont !== "string" ||
      !ALLOWED_RESUME_FONTS_SET.has(value.headingFont)
    ) {
      return { error: "headingFont is not allowed." };
    }
    theme.headingFont = value.headingFont;
  }

  if (value.bodyFont !== undefined) {
    if (
      typeof value.bodyFont !== "string" ||
      !ALLOWED_RESUME_FONTS_SET.has(value.bodyFont)
    ) {
      return { error: "bodyFont is not allowed." };
    }
    theme.bodyFont = value.bodyFont;
  }

  if (value.fontSize !== undefined) {
    if (
      typeof value.fontSize !== "number" ||
      !Number.isFinite(value.fontSize) ||
      value.fontSize < 9 ||
      value.fontSize > 12
    ) {
      return { error: "fontSize must be a number between 9 and 12." };
    }
    theme.fontSize = value.fontSize;
  }

  if (value.pageMargin !== undefined) {
    if (
      value.pageMargin !== "compact" &&
      value.pageMargin !== "normal" &&
      value.pageMargin !== "relaxed"
    ) {
      return { error: "pageMargin must be compact, normal, or relaxed." };
    }
    theme.pageMargin = value.pageMargin;
  }

  if (value.sidebarWidth !== undefined) {
    if (value.sidebarWidth !== "narrow" && value.sidebarWidth !== "normal") {
      return { error: "sidebarWidth must be narrow or normal." };
    }
    theme.sidebarWidth = value.sidebarWidth;
  }

  if (value.sectionOrder !== undefined) {
    const parsed = parseSectionIdList(value.sectionOrder, "sectionOrder");
    if ("error" in parsed) return parsed;
    theme.sectionOrder = parsed;
  }

  if (value.hiddenSections !== undefined) {
    const parsed = parseSectionIdList(value.hiddenSections, "hiddenSections");
    if ("error" in parsed) return parsed;
    theme.hiddenSections = parsed;
  }

  return theme;
}

function normalizeSectionOrder(order: ResumeSectionId[]): ResumeSectionId[] {
  const seen = new Set<ResumeSectionId>();
  const normalized: ResumeSectionId[] = [];

  for (const id of order) {
    if (!SECTION_IDS.includes(id) || seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
  }

  for (const id of SECTION_IDS) {
    if (!seen.has(id)) {
      normalized.push(id);
    }
  }

  return normalized;
}

/** Removes theme keys that the target template does not support. */
export function sanitizeThemeForTemplate(
  theme: ResumeTheme | null,
  templateId: string,
  supportsSidebarWidth: boolean,
): ResumeTheme | null {
  if (!theme) return null;

  const next: ResumeTheme = { ...theme };
  if (!supportsSidebarWidth) {
    delete next.sidebarWidth;
  }

  if (Object.keys(next).length === 0) {
    return null;
  }

  return next;
}

/** Validates user theme overrides; returns `null` when empty (template defaults). */
export function validateResumeTheme(
  value: unknown,
  templateId: string,
  supportsSidebarWidth = templateId === "sidebar",
): ResumeTheme | null | { error: string } {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = parseResumeTheme(value);
  if ("error" in parsed) return parsed;

  const sanitized = sanitizeThemeForTemplate(
    parsed,
    templateId,
    supportsSidebarWidth,
  );
  if (!sanitized) return null;

  if (sanitized.sectionOrder) {
    sanitized.sectionOrder = normalizeSectionOrder(sanitized.sectionOrder);
  }

  return sanitized;
}

export function getResolvedTheme(
  templateDefaults: ResumeTheme,
  userTheme: ResumeTheme | null,
): ResolvedTheme {
  return mergeTheme(templateDefaults, userTheme);
}

export function fontSizeToPreset(fontSize: number): FontSizePreset {
  if (fontSize <= FONT_SIZE_PRESETS.small) return "small";
  if (fontSize >= FONT_SIZE_PRESETS.large) return "large";
  return "medium";
}

export function mergeTheme(
  templateDefaults: ResumeTheme,
  userTheme: ResumeTheme | null,
): ResolvedTheme {
  const merged: ResumeTheme = {
    ...templateDefaults,
    ...(userTheme ?? {}),
  };

  const baseFontSize = merged.fontSize ?? DEFAULT_CLASSIC_THEME.fontSize ?? 10;
  const pageMargin = merged.pageMargin ?? "normal";

  const sectionOrder =
    merged.sectionOrder && merged.sectionOrder.length > 0
      ? normalizeSectionOrder(merged.sectionOrder)
      : DEFAULT_SECTION_ORDER;

  const hiddenSections = merged.hiddenSections ?? [];
  const sidebarWidth =
    merged.sidebarWidth === "narrow" ? "narrow" : "normal";

  return {
    primaryColor: merged.primaryColor ?? DEFAULT_CLASSIC_THEME.primaryColor!,
    headingColor: merged.headingColor ?? DEFAULT_CLASSIC_THEME.headingColor!,
    textColor: merged.textColor ?? DEFAULT_CLASSIC_THEME.textColor!,
    mutedColor: merged.mutedColor ?? DEFAULT_CLASSIC_THEME.mutedColor!,
    headingFont: merged.headingFont ?? DEFAULT_CLASSIC_THEME.headingFont!,
    bodyFont: merged.bodyFont ?? DEFAULT_CLASSIC_THEME.bodyFont!,
    fontSize: baseFontSize,
    pageMargin,
    sidebarWidth,
    sectionOrder,
    hiddenSections,
  };
}

export type ResumePdfStyles = ReturnType<typeof createPdfStyles>;

export function createPdfStyles(resolved: ResolvedTheme) {
  const margins = PAGE_MARGINS[resolved.pageMargin];
  const contactMuted = "#444444";
  const linkSeparatorColor = "#666666";
  const sectionBorderColor = "#bdbdbd";

  return StyleSheet.create({
    page: {
      ...margins,
      fontFamily: resolved.bodyFont,
      fontSize: resolved.fontSize,
      lineHeight: 1.4,
      color: resolved.headingColor,
    },
    name: {
      fontSize: 22,
      fontFamily: resolved.headingFont,
      flex: 1,
      paddingRight: 8,
      color: resolved.headingColor,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    contactRow: {
      fontSize: 9,
      color: contactMuted,
      textAlign: "right",
      maxWidth: 220,
    },
    linksRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      fontSize: 9,
      marginBottom: 0,
    },
    linkItem: {
      color: resolved.primaryColor,
      textDecoration: "none",
    },
    linkSeparator: {
      marginHorizontal: 5,
      color: linkSeparatorColor,
    },
    section: {
      marginTop: 14,
    },
    summarySection: {
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: resolved.headingFont,
      marginBottom: 6,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: sectionBorderColor,
      color: resolved.headingColor,
    },
    bodyText: {
      fontSize: resolved.fontSize,
      color: resolved.textColor,
    },
    skillsText: {
      fontSize: resolved.fontSize,
      color: resolved.textColor,
    },
    entryBlock: {
      marginBottom: 10,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    entryTitle: {
      fontFamily: resolved.headingFont,
      fontSize: resolved.fontSize,
      flex: 1,
      paddingRight: 8,
      color: resolved.headingColor,
    },
    entryDates: {
      fontSize: 9,
      color: resolved.mutedColor,
      textAlign: "right",
      minWidth: 72,
    },
    entrySub: {
      fontSize: 9,
      color: resolved.mutedColor,
      marginBottom: 3,
    },
    bullet: {
      fontSize: 9,
      color: resolved.textColor,
      marginLeft: 8,
      marginBottom: 2,
    },
  });
}

export function isSectionVisible(
  resolved: ResolvedTheme,
  sectionId: ResumeSectionId,
): boolean {
  return !resolved.hiddenSections.includes(sectionId);
}

export function orderedVisibleSections(resolved: ResolvedTheme): ResumeSectionId[] {
  return resolved.sectionOrder.filter((id) => isSectionVisible(resolved, id));
}

export type SidebarResumePdfStyles = ReturnType<typeof createSidebarPdfStyles>;

export function sidebarWidthPercent(width: SidebarWidth): string {
  return width === "narrow" ? "26%" : "30%";
}

export function mainWidthPercent(width: SidebarWidth): string {
  return width === "narrow" ? "74%" : "70%";
}

export type MinimalResumePdfStyles = ReturnType<typeof createMinimalPdfStyles>;

export function createMinimalPdfStyles(resolved: ResolvedTheme) {
  const base = createPdfStyles(resolved);

  return StyleSheet.create({
    ...base,
    page: {
      ...base.page,
      textAlign: "center",
    },
    headerBlock: {
      marginBottom: 12,
      alignItems: "center",
    },
    name: {
      ...base.name,
      flex: undefined,
      paddingRight: 0,
      textAlign: "center",
      width: "100%",
    },
    contactRow: {
      ...base.contactRow,
      textAlign: "center",
      maxWidth: "100%",
      marginTop: 4,
    },
    linksRow: {
      ...base.linksRow,
      justifyContent: "center",
    },
    sectionTitle: {
      ...base.sectionTitle,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: resolved.primaryColor,
    },
    entryHeader: {
      ...base.entryHeader,
      textAlign: "left",
    },
    bodyText: {
      ...base.bodyText,
      textAlign: "left",
    },
    skillsText: {
      ...base.skillsText,
      textAlign: "left",
    },
    entryBlock: base.entryBlock,
    entryTitle: base.entryTitle,
    entryDates: base.entryDates,
    entrySub: base.entrySub,
    bullet: base.bullet,
    section: base.section,
    summarySection: base.summarySection,
  });
}

export type AccentBarResumePdfStyles = ReturnType<typeof createAccentBarPdfStyles>;

export function createAccentBarPdfStyles(resolved: ResolvedTheme) {
  const base = createPdfStyles(resolved);
  const margins = PAGE_MARGINS[resolved.pageMargin];

  return StyleSheet.create({
    ...base,
    page: {
      ...base.page,
      paddingTop: 0,
    },
    accentBar: {
      height: 10,
      backgroundColor: resolved.primaryColor,
      marginBottom: margins.paddingTop,
      marginHorizontal: -margins.paddingHorizontal,
    },
    content: {
      paddingHorizontal: margins.paddingHorizontal,
    },
  });
}

export function createSidebarPdfStyles(resolved: ResolvedTheme) {
  const base = createPdfStyles(resolved);
  const margins = PAGE_MARGINS[resolved.pageMargin];
  const sidebarBg = "#f4f4f4";
  const sidebarAccent = resolved.primaryColor;
  const sidebarPct = sidebarWidthPercent(resolved.sidebarWidth);
  const mainPct = mainWidthPercent(resolved.sidebarWidth);

  return StyleSheet.create({
    page: {
      ...base.page,
      flexDirection: "row",
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    sidebar: {
      width: sidebarPct,
      backgroundColor: sidebarBg,
      paddingTop: margins.paddingTop,
      paddingBottom: margins.paddingBottom,
      paddingHorizontal: Math.max(16, margins.paddingHorizontal - 12),
      borderRightWidth: 2,
      borderRightColor: sidebarAccent,
    },
    main: {
      width: mainPct,
      paddingTop: margins.paddingTop,
      paddingBottom: margins.paddingBottom,
      paddingHorizontal: Math.max(20, margins.paddingHorizontal - 12),
      fontFamily: resolved.bodyFont,
      fontSize: resolved.fontSize,
      lineHeight: 1.4,
      color: resolved.headingColor,
    },
    sidebarName: {
      fontSize: 16,
      fontFamily: resolved.headingFont,
      color: resolved.headingColor,
      marginBottom: 8,
    },
    sidebarContact: {
      fontSize: 8,
      color: resolved.mutedColor,
      marginBottom: 10,
      lineHeight: 1.5,
    },
    sidebarLinks: {
      marginBottom: 12,
    },
    sidebarLink: {
      fontSize: 8,
      color: resolved.primaryColor,
      textDecoration: "none",
      marginBottom: 3,
    },
    sidebarSection: {
      marginTop: 12,
    },
    sidebarSectionTitle: {
      fontSize: 9,
      fontFamily: resolved.headingFont,
      color: sidebarAccent,
      marginBottom: 4,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sidebarSkillsText: {
      fontSize: 8,
      color: resolved.textColor,
      lineHeight: 1.45,
    },
    name: base.name,
    headerRow: base.headerRow,
    contactRow: base.contactRow,
    linksRow: base.linksRow,
    linkItem: base.linkItem,
    linkSeparator: base.linkSeparator,
    section: base.section,
    summarySection: base.summarySection,
    sectionTitle: base.sectionTitle,
    bodyText: base.bodyText,
    skillsText: base.skillsText,
    entryBlock: base.entryBlock,
    entryHeader: base.entryHeader,
    entryTitle: base.entryTitle,
    entryDates: base.entryDates,
    entrySub: base.entrySub,
    bullet: base.bullet,
  });
}
