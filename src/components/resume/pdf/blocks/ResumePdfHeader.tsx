import { Link, Text, View } from "@react-pdf/renderer";
import {
  buildContactParts,
  buildLinkParts,
} from "@/lib/resume-pdf-format";
import type { ResumePdfStyles } from "@/lib/resume-templates/theme";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type ResumePdfHeaderProps = {
  data: ResumeProfileFormData;
  styles: ResumePdfStyles;
};

export function ResumePdfHeader({ data, styles }: ResumePdfHeaderProps) {
  const contactParts = buildContactParts(data);
  const linkParts = buildLinkParts(data);

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{data.fullName.trim()}</Text>
        {contactParts.length > 0 && (
          <Text style={styles.contactRow}>{contactParts.join(" · ")}</Text>
        )}
      </View>

      {linkParts.length > 0 && (
        <View style={styles.linksRow}>
          {linkParts.map((url, index) => (
            <View
              key={url}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Link src={url} style={styles.linkItem}>
                <Text>{url}</Text>
              </Link>
              {index < linkParts.length - 1 && (
                <Text style={styles.linkSeparator}>·</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </>
  );
}
