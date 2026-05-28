import { Text } from "@react-pdf/renderer";
import { splitSkillItems } from "@/lib/resume-pdf-format";
import type { ResumePdfStyles } from "@/lib/resume-templates/theme";
import { ResumePdfSection } from "./ResumePdfSection";

type ResumePdfSkillsProps = {
  skills: string;
  styles: ResumePdfStyles;
};

export function ResumePdfSkills({ skills, styles }: ResumePdfSkillsProps) {
  const items = splitSkillItems(skills);
  if (items.length === 0) return null;

  return (
    <ResumePdfSection title="Skills" styles={styles}>
      <Text style={styles.skillsText}>{items.join(" · ")}</Text>
    </ResumePdfSection>
  );
}
