import { ClassicLetterTemplate } from "@/components/cover-letter/pdf/ClassicLetterTemplate";
import type { CoverLetterTheme } from "@/lib/cover-letter-theme";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

type CoverLetterPdfDocumentProps = {
  data: CoverLetterFormData;
  theme?: CoverLetterTheme | null;
};

export function CoverLetterPdfDocument({
  data,
  theme = null,
}: CoverLetterPdfDocumentProps) {
  return <ClassicLetterTemplate data={data} theme={theme} />;
}
