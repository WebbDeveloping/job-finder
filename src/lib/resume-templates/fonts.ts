import path from "node:path";
import { Font } from "@react-pdf/renderer";

/** Font family names accepted in `Resume.theme` (must match `Font.register`). */
export const ALLOWED_RESUME_FONTS = [
  "Helvetica",
  "Helvetica-Bold",
  "Inter",
  "Inter-Bold",
  "Lora",
  "Lora-Bold",
] as const;

export type AllowedResumeFont = (typeof ALLOWED_RESUME_FONTS)[number];

export const ALLOWED_RESUME_FONTS_SET = new Set<string>(ALLOWED_RESUME_FONTS);

export const RESUME_BODY_FONT_OPTIONS = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Inter", label: "Inter" },
  { value: "Lora", label: "Lora" },
] as const;

export const RESUME_HEADING_FONT_OPTIONS = [
  { value: "Helvetica-Bold", label: "Helvetica" },
  { value: "Inter-Bold", label: "Inter" },
  { value: "Lora-Bold", label: "Lora" },
] as const;

let registered = false;

function fontSrc(filename: string): string {
  if (typeof window === "undefined") {
    return path.join(process.cwd(), "public", "fonts", filename);
  }
  return `/fonts/${filename}`;
}

export function registerResumeFonts(): void {
  if (registered) return;
  registered = true;

  Font.register({ family: "Inter", src: fontSrc("Inter-Regular.ttf") });
  Font.register({ family: "Inter-Bold", src: fontSrc("Inter-Bold.ttf") });
  Font.register({ family: "Lora", src: fontSrc("Lora-Regular.ttf") });
  Font.register({ family: "Lora-Bold", src: fontSrc("Lora-Bold.ttf") });
}
