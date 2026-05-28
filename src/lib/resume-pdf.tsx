import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/resume/pdf/ResumePdfDocument";
import { resumePdfFilename } from "@/lib/resume-pdf-format";
import type { ResumeDesign } from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

export async function generateResumePdf(
  data: ResumeProfileFormData,
  design: ResumeDesign,
): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await renderToBuffer(
    <ResumePdfDocument data={data} design={design} />,
  );
  return {
    buffer: Buffer.from(buffer),
    filename: resumePdfFilename(data.fullName),
  };
}
