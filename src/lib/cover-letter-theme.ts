import { ALLOWED_RESUME_FONTS_SET } from "@/lib/resume-templates/fonts";
import { FONT_SIZE_PRESETS } from "@/lib/resume-templates/theme";

export type CoverLetterPageMargin = "compact" | "normal" | "relaxed";

export type CoverLetterTheme = {
  bodyFont?: string;
  fontSize?: number;
  pageMargin?: CoverLetterPageMargin;
};

export const COVER_LETTER_PAGE_MARGINS = {
  compact: { paddingTop: 44, paddingBottom: 44, paddingHorizontal: 44 },
  normal: { paddingTop: 54, paddingBottom: 54, paddingHorizontal: 54 },
  relaxed: { paddingTop: 64, paddingBottom: 64, paddingHorizontal: 64 },
} as const;

export const DEFAULT_COVER_LETTER_THEME: Required<CoverLetterTheme> = {
  bodyFont: "Helvetica",
  fontSize: FONT_SIZE_PRESETS.large,
  pageMargin: "normal",
};

export type ResolvedCoverLetterTheme = {
  bodyFont: string;
  signatureFont: string;
  fontSize: number;
  senderFontSize: number;
  pageMargin: CoverLetterPageMargin;
};

const THEME_KEYS = new Set(["bodyFont", "fontSize", "pageMargin"]);
const PAGE_MARGIN_VALUES = new Set<CoverLetterPageMargin>([
  "compact",
  "normal",
  "relaxed",
]);
const FONT_SIZE_VALUES = new Set<number>(Object.values(FONT_SIZE_PRESETS));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boldFontForBody(bodyFont: string): string {
  switch (bodyFont) {
    case "Inter":
      return "Inter-Bold";
    case "Lora":
      return "Lora-Bold";
    default:
      return "Helvetica-Bold";
  }
}

export function getResolvedCoverLetterTheme(
  userTheme: CoverLetterTheme | null,
): ResolvedCoverLetterTheme {
  const bodyFont = userTheme?.bodyFont ?? DEFAULT_COVER_LETTER_THEME.bodyFont;
  const fontSize = userTheme?.fontSize ?? DEFAULT_COVER_LETTER_THEME.fontSize;
  const pageMargin =
    userTheme?.pageMargin ?? DEFAULT_COVER_LETTER_THEME.pageMargin;

  return {
    bodyFont,
    signatureFont: boldFontForBody(bodyFont),
    fontSize,
    senderFontSize: Math.max(fontSize - 1, 9),
    pageMargin,
  };
}

export function parseCoverLetterTheme(
  value: unknown,
): CoverLetterTheme | { error: string } {
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

  const theme: CoverLetterTheme = {};

  if (value.bodyFont !== undefined) {
    if (
      typeof value.bodyFont !== "string" ||
      !ALLOWED_RESUME_FONTS_SET.has(value.bodyFont) ||
      value.bodyFont.endsWith("-Bold")
    ) {
      return { error: "bodyFont is not allowed." };
    }
    theme.bodyFont = value.bodyFont;
  }

  if (value.fontSize !== undefined) {
    if (
      typeof value.fontSize !== "number" ||
      !Number.isFinite(value.fontSize) ||
      !FONT_SIZE_VALUES.has(value.fontSize)
    ) {
      return { error: "fontSize must be a preset value." };
    }
    theme.fontSize = value.fontSize;
  }

  if (value.pageMargin !== undefined) {
    if (
      typeof value.pageMargin !== "string" ||
      !PAGE_MARGIN_VALUES.has(value.pageMargin as CoverLetterPageMargin)
    ) {
      return { error: "pageMargin must be compact, normal, or relaxed." };
    }
    theme.pageMargin = value.pageMargin as CoverLetterPageMargin;
  }

  return theme;
}

export function parseCoverLetterThemeField(
  value: unknown,
): CoverLetterTheme | null | { error: string } {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = parseCoverLetterTheme(value);
  if ("error" in parsed) return parsed;

  if (
    parsed.bodyFont === undefined &&
    parsed.fontSize === undefined &&
    parsed.pageMargin === undefined
  ) {
    return null;
  }

  return parsed;
}

export function toCoverLetterTheme(
  value: unknown,
): CoverLetterTheme | null {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = parseCoverLetterTheme(value);
  if ("error" in parsed) {
    return null;
  }
  if (
    parsed.bodyFont === undefined &&
    parsed.fontSize === undefined &&
    parsed.pageMargin === undefined
  ) {
    return null;
  }
  return parsed;
}
