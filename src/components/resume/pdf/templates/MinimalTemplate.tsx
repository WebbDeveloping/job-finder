import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import { ResumePdfEducation } from "@/components/resume/pdf/blocks/ResumePdfEducation";
import { ResumePdfExperience } from "@/components/resume/pdf/blocks/ResumePdfExperience";
import { ResumePdfSection } from "@/components/resume/pdf/blocks/ResumePdfSection";
import { ResumePdfSkills } from "@/components/resume/pdf/blocks/ResumePdfSkills";
import {
  buildContactParts,
  buildLinkParts,
} from "@/lib/resume-pdf-format";
import {
  createMinimalPdfStyles,
  orderedVisibleSections,
  type MinimalResumePdfStyles,
  type ResolvedTheme,
  type ResumePdfStyles,
  type ResumeSectionId,
} from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type MinimalTemplateProps = {
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

function MinimalHeader({
  data,
  styles,
}: {
  data: ResumeProfileFormData;
  styles: MinimalResumePdfStyles;
}) {
  const contactParts = buildContactParts(data);
  const linkParts = buildLinkParts(data);

  return (
    <View style={styles.headerBlock}>
      <Text style={styles.name}>{data.fullName.trim()}</Text>
      {contactParts.length > 0 ? (
        <Text style={styles.contactRow}>{contactParts.join(" · ")}</Text>
      ) : null}
      {linkParts.length > 0 ? (
        <View style={styles.linksRow}>
          {linkParts.map((url, index) => (
            <View
              key={url}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Link src={url} style={styles.linkItem}>
                <Text>{url}</Text>
              </Link>
              {index < linkParts.length - 1 ? (
                <Text style={styles.linkSeparator}>·</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function MinimalTemplate({ data, resolved }: MinimalTemplateProps) {
  const styles = createMinimalPdfStyles(resolved);
  const blockStyles = styles as unknown as ResumePdfStyles;
  const sections = orderedVisibleSections(resolved);

  return (
    <Document title={`${data.fullName.trim()} — Resume`}>
      <Page size="LETTER" style={styles.page} wrap>
        <MinimalHeader data={data} styles={styles} />
        {sections.map((sectionId) =>
          renderSection(sectionId, data, blockStyles),
        )}
      </Page>
    </Document>
  );
}
