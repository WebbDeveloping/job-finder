import { AccentBarTemplate } from "@/components/resume/pdf/templates/AccentBarTemplate";
import { ClassicTemplate } from "@/components/resume/pdf/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/resume/pdf/templates/MinimalTemplate";
import { SidebarTemplate } from "@/components/resume/pdf/templates/SidebarTemplate";
import { registerResumeFonts } from "@/lib/resume-templates/fonts";
import { getTemplate } from "@/lib/resume-templates/registry";
import {
  createPdfStyles,
  mergeTheme,
  type ResumeDesign,
} from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

registerResumeFonts();

type ResumePdfDocumentProps = {
  data: ResumeProfileFormData;
  design: ResumeDesign;
};

export function ResumePdfDocument({ data, design }: ResumePdfDocumentProps) {
  const template = getTemplate(design.templateId);
  const resolved = mergeTheme(template.defaultTheme, design.theme);
  const styles = createPdfStyles(resolved);

  switch (template.id) {
    case "sidebar":
      return <SidebarTemplate data={data} resolved={resolved} />;
    case "minimal":
      return <MinimalTemplate data={data} resolved={resolved} />;
    case "accent-bar":
      return <AccentBarTemplate data={data} resolved={resolved} />;
    case "classic":
    default:
      return (
        <ClassicTemplate data={data} resolved={resolved} styles={styles} />
      );
  }
}
