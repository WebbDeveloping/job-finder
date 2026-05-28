import { Text, View } from "@react-pdf/renderer";
import {
  formatDateRange,
  formatEducationLine,
} from "@/lib/resume-pdf-format";
import type { ResumePdfStyles } from "@/lib/resume-templates/theme";
import type { ResumeEducationEntry } from "@/lib/resume-types";
import { ResumePdfSection } from "./ResumePdfSection";

type ResumePdfEducationProps = {
  education: ResumeEducationEntry[];
  styles: ResumePdfStyles;
};

export function ResumePdfEducation({
  education,
  styles,
}: ResumePdfEducationProps) {
  if (education.length === 0) return null;

  return (
    <ResumePdfSection title="Education" styles={styles}>
      {education.map((entry) => {
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
    </ResumePdfSection>
  );
}
