import { StyleSheet } from "@react-pdf/renderer";
import {
  COVER_LETTER_PAGE_MARGINS,
  type ResolvedCoverLetterTheme,
} from "@/lib/cover-letter-theme";
import { registerResumeFonts } from "@/lib/resume-templates/fonts";

registerResumeFonts();

export function createCoverLetterPdfStyles(resolved: ResolvedCoverLetterTheme) {
  const margins = COVER_LETTER_PAGE_MARGINS[resolved.pageMargin];
  const textColor = "#333333";

  return StyleSheet.create({
    page: {
      ...margins,
      fontFamily: resolved.bodyFont,
      fontSize: resolved.fontSize,
      lineHeight: 1.45,
      color: textColor,
    },
    senderBlock: {
      marginBottom: 20,
    },
    senderLine: {
      fontSize: resolved.senderFontSize,
      lineHeight: 1.4,
      color: textColor,
    },
    date: {
      fontSize: resolved.senderFontSize,
      marginBottom: 20,
      color: textColor,
    },
    salutation: {
      marginBottom: 12,
      fontSize: resolved.fontSize,
    },
    bodyParagraph: {
      marginBottom: 12,
      fontSize: resolved.fontSize,
      textAlign: "justify",
    },
    closingBlock: {
      marginTop: 8,
    },
    closing: {
      marginBottom: 24,
      fontSize: resolved.fontSize,
    },
    signature: {
      fontSize: resolved.fontSize,
      fontFamily: resolved.signatureFont,
    },
  });
}
