import { Text, View } from "@react-pdf/renderer";
import {
  formatDateRange,
  formatExperienceHeader,
  splitHighlightLines,
} from "@/lib/resume-pdf-format";
import type { ResumePdfStyles } from "@/lib/resume-templates/theme";
import type { ResumeExperienceEntry } from "@/lib/resume-types";
import { ResumePdfSection } from "./ResumePdfSection";

type ResumePdfExperienceProps = {
  experience: ResumeExperienceEntry[];
  styles: ResumePdfStyles;
};

export function ResumePdfExperience({
  experience,
  styles,
}: ResumePdfExperienceProps) {
  if (experience.length === 0) return null;

  return (
    <ResumePdfSection title="Experience" styles={styles}>
      {experience.map((entry) => {
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
    </ResumePdfSection>
  );
}
