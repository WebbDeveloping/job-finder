import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  buildContactParts,
  buildLinkParts,
  formatDateRange,
  formatEducationLine,
  formatExperienceHeader,
  splitHighlightLines,
  splitSkillItems,
} from "@/lib/resume-pdf-format";
import type { ResumeProfileFormData } from "@/lib/resume-types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#1a1a1a",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  contactRow: {
    fontSize: 9,
    color: "#444",
    marginBottom: 2,
  },
  linkRow: {
    fontSize: 9,
    marginBottom: 2,
  },
  link: {
    color: "#1565c0",
    textDecoration: "none",
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#bdbdbd",
  },
  bodyText: {
    fontSize: 10,
    color: "#333",
  },
  skillsText: {
    fontSize: 10,
    color: "#333",
  },
  entryBlock: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    flex: 1,
    paddingRight: 8,
  },
  entryDates: {
    fontSize: 9,
    color: "#555",
    textAlign: "right",
    minWidth: 72,
  },
  entrySub: {
    fontSize: 9,
    color: "#555",
    marginBottom: 3,
  },
  bullet: {
    fontSize: 9,
    color: "#333",
    marginLeft: 8,
    marginBottom: 2,
  },
});

type ResumePdfDocumentProps = {
  data: ResumeProfileFormData;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function ResumePdfDocument({ data }: ResumePdfDocumentProps) {
  const contactParts = buildContactParts(data);
  const linkParts = buildLinkParts(data);
  const skills = splitSkillItems(data.skills);

  return (
    <Document title={`${data.fullName.trim()} — Resume`}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{data.fullName.trim()}</Text>

        {contactParts.length > 0 && (
          <Text style={styles.contactRow}>{contactParts.join(" · ")}</Text>
        )}

        {linkParts.map((url) => (
          <View key={url} style={styles.linkRow}>
            <Link src={url} style={styles.link}>
              <Text>{url}</Text>
            </Link>
          </View>
        ))}

        {data.summary.trim() !== "" && (
          <Section title="Summary">
            <Text style={styles.bodyText}>{data.summary.trim()}</Text>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <Text style={styles.skillsText}>{skills.join(" · ")}</Text>
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Experience">
            {data.experience.map((entry) => {
              const dates = formatDateRange(entry.startDate, entry.endDate);
              const location = entry.location.trim();
              const bullets = splitHighlightLines(entry.highlights);

              return (
                <View key={entry.id} style={styles.entryBlock} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {formatExperienceHeader(entry)}
                    </Text>
                    {dates !== "" && (
                      <Text style={styles.entryDates}>{dates}</Text>
                    )}
                  </View>
                  {location !== "" && (
                    <Text style={styles.entrySub}>{location}</Text>
                  )}
                  {bullets.map((line) => (
                    <Text key={line} style={styles.bullet}>
                      • {line}
                    </Text>
                  ))}
                </View>
              );
            })}
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((entry) => {
              const dates = formatDateRange(entry.startDate, entry.endDate);
              const line = formatEducationLine(entry);

              return (
                <View key={entry.id} style={styles.entryBlock} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {entry.school.trim()}
                      {line !== "" ? ` — ${line}` : ""}
                    </Text>
                    {dates !== "" && (
                      <Text style={styles.entryDates}>{dates}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </Section>
        )}
      </Page>
    </Document>
  );
}
