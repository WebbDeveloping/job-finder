import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import { ResumePdfEducation } from "@/components/resume/pdf/blocks/ResumePdfEducation";
import { ResumePdfExperience } from "@/components/resume/pdf/blocks/ResumePdfExperience";
import { ResumePdfSection } from "@/components/resume/pdf/blocks/ResumePdfSection";
import {
  buildContactParts,
  buildLinkParts,
  splitSkillItems,
} from "@/lib/resume-pdf-format";
import {
  createSidebarPdfStyles,
  isSectionVisible,
  type ResolvedTheme,
  type ResumePdfStyles,
  type ResumeSectionId,
  type SidebarResumePdfStyles,
} from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type SidebarTemplateProps = {
  data: ResumeProfileFormData;
  resolved: ResolvedTheme;
};

function renderMainSection(
  sectionId: ResumeSectionId,
  data: ResumeProfileFormData,
  blockStyles: ResumePdfStyles,
) {
  switch (sectionId) {
    case "summary":
      if (data.summary.trim() === "") return null;
      return (
        <ResumePdfSection
          key="summary"
          title="Summary"
          styles={blockStyles}
          sectionStyle={blockStyles.summarySection}
        >
          <Text style={blockStyles.bodyText}>{data.summary.trim()}</Text>
        </ResumePdfSection>
      );
    case "experience":
      return (
        <ResumePdfExperience
          key="experience"
          experience={data.experience}
          styles={blockStyles}
        />
      );
    case "education":
      return (
        <ResumePdfEducation
          key="education"
          education={data.education}
          styles={blockStyles}
        />
      );
    default:
      return null;
  }
}

function SidebarSkills({
  skills,
  styles,
  visible,
}: {
  skills: string;
  styles: SidebarResumePdfStyles;
  visible: boolean;
}) {
  if (!visible) return null;
  const items = splitSkillItems(skills);
  if (items.length === 0) return null;

  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarSectionTitle}>Skills</Text>
      <Text style={styles.sidebarSkillsText}>{items.join(" · ")}</Text>
    </View>
  );
}

export function SidebarTemplate({ data, resolved }: SidebarTemplateProps) {
  const styles = createSidebarPdfStyles(resolved);
  const blockStyles = styles as unknown as ResumePdfStyles;
  const contactParts = buildContactParts(data);
  const linkParts = buildLinkParts(data);
  const mainSections = resolved.sectionOrder.filter(
    (id) => id !== "skills" && isSectionVisible(resolved, id),
  );
  const showSkills = isSectionVisible(resolved, "skills");

  return (
    <Document title={`${data.fullName.trim()} — Resume`}>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{data.fullName.trim()}</Text>
          {contactParts.length > 0 ? (
            <Text style={styles.sidebarContact}>{contactParts.join("\n")}</Text>
          ) : null}
          {linkParts.length > 0 ? (
            <View style={styles.sidebarLinks}>
              {linkParts.map((url) => (
                <Link key={url} src={url} style={styles.sidebarLink}>
                  <Text>{url}</Text>
                </Link>
              ))}
            </View>
          ) : null}
          <SidebarSkills
            skills={data.skills}
            styles={styles}
            visible={showSkills}
          />
        </View>
        <View style={styles.main}>
          {mainSections.map((sectionId) =>
            renderMainSection(sectionId, data, blockStyles),
          )}
        </View>
      </Page>
    </Document>
  );
}
