import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ResumePdfEducation } from "@/components/resume/pdf/blocks/ResumePdfEducation";
import { ResumePdfExperience } from "@/components/resume/pdf/blocks/ResumePdfExperience";
import { ResumePdfHeader } from "@/components/resume/pdf/blocks/ResumePdfHeader";
import { ResumePdfSection } from "@/components/resume/pdf/blocks/ResumePdfSection";
import { ResumePdfSkills } from "@/components/resume/pdf/blocks/ResumePdfSkills";
import {
  createAccentBarPdfStyles,
  orderedVisibleSections,
  type ResolvedTheme,
  type ResumePdfStyles,
  type ResumeSectionId,
} from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type AccentBarTemplateProps = {
  data: ResumeProfileFormData;
  resolved: ResolvedTheme;
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

export function AccentBarTemplate({ data, resolved }: AccentBarTemplateProps) {
  const styles = createAccentBarPdfStyles(resolved);
  const blockStyles = styles as unknown as ResumePdfStyles;
  const sections = orderedVisibleSections(resolved);

  return (
    <Document title={`${data.fullName.trim()} — Resume`}>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          <ResumePdfHeader data={data} styles={blockStyles} />
          {sections.map((sectionId) =>
            renderSection(sectionId, data, blockStyles),
          )}
        </View>
      </Page>
    </Document>
  );
}
