import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/resume/ResumePdfDocument";
import { resumePdfFilename } from "@/lib/resume-pdf-format";
import type { ResumeProfileFormData } from "@/lib/resume-types";

export async function generateResumePdf(
  data: ResumeProfileFormData,
): Promise<{ buffer: Buffer; filename: string }> {
  const buffer = await renderToBuffer(<ResumePdfDocument data={data} />);
  return {
    buffer: Buffer.from(buffer),
    filename: resumePdfFilename(data.fullName),
  };
}
