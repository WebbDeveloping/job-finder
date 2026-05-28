import { Document, Page, Text } from "@react-pdf/renderer";
import { ResumePdfEducation } from "@/components/resume/pdf/blocks/ResumePdfEducation";
import { ResumePdfExperience } from "@/components/resume/pdf/blocks/ResumePdfExperience";
import { ResumePdfHeader } from "@/components/resume/pdf/blocks/ResumePdfHeader";
import { ResumePdfSection } from "@/components/resume/pdf/blocks/ResumePdfSection";
import { ResumePdfSkills } from "@/components/resume/pdf/blocks/ResumePdfSkills";
import type {
  ResolvedTheme,
  ResumePdfStyles,
  ResumeSectionId,
} from "@/lib/resume-templates/theme";
import { orderedVisibleSections } from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type ClassicTemplateProps = {
  data: ResumeProfileFormData;
  resolved: ResolvedTheme;
  styles: ResumePdfStyles;
};

function renderSection(
  sectionId: ResumeSectionId,
  data: ResumeProfileFormData,
  styles: ResumePdfStyles,
) {
  switch (sectionId) {
    case "summary":
      if (data.summary.trim() === "") return null;
      return (
        <ResumePdfSection
          key="summary"
          title="Summary"
          styles={styles}
          sectionStyle={styles.summarySection}
        >
          <Text style={styles.bodyText}>{data.summary.trim()}</Text>
        </ResumePdfSection>
      );
    case "skills":
      return (
        <ResumePdfSkills key="skills" skills={data.skills} styles={styles} />
      );
    case "experience":
      return (
        <ResumePdfExperience
          key="experience"
          experience={data.experience}
          styles={styles}
        />
      );
    case "education":
      return (
        <ResumePdfEducation
          key="education"
          education={data.education}
          styles={styles}
        />
      );
    default:
      return null;
  }
}

export function ClassicTemplate({ data, resolved, styles }: ClassicTemplateProps) {
  const sections = orderedVisibleSections(resolved);

  return (
    <Document title={`${data.fullName.trim()} — Resume`}>
      <Page size="LETTER" style={styles.page}>
        <ResumePdfHeader data={data} styles={styles} />
        {sections.map((sectionId) => renderSection(sectionId, data, styles))}
      </Page>
    </Document>
  );
}
