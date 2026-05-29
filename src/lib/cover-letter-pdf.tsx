import { renderToBuffer } from "@react-pdf/renderer";
import { CoverLetterPdfDocument } from "@/components/cover-letter/pdf/CoverLetterPdfDocument";
import { coverLetterPdfFilename } from "@/lib/cover-letter-pdf-format";
import type { CoverLetterTheme } from "@/lib/cover-letter-theme";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

export async function generateCoverLetterPdf(
  data: CoverLetterFormData,
  theme: CoverLetterTheme | null = null,
): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await renderToBuffer(
    <CoverLetterPdfDocument data={data} theme={theme} />,
  );
  return {
    buffer: Buffer.from(buffer),
    filename: coverLetterPdfFilename(data),
  };
}
