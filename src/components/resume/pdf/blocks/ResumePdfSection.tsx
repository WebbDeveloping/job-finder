import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumePdfStyles } from "@/lib/resume-templates/theme";

type ResumePdfSectionProps = {
  title: string;
  styles: ResumePdfStyles;
  children: React.ReactNode;
  sectionStyle?: ReturnType<typeof StyleSheet.create>[string];
};

export function ResumePdfSection({
  title,
  styles,
  children,
  sectionStyle,
}: ResumePdfSectionProps) {
  return (
    <View style={sectionStyle ? [styles.section, sectionStyle] : styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
