import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  buildCoverLetterContactLines,
  splitCoverLetterBodyParagraphs,
} from "@/lib/cover-letter-pdf-format";
import { createCoverLetterPdfStyles } from "@/lib/cover-letter-pdf-styles";
import {
  getResolvedCoverLetterTheme,
  type CoverLetterTheme,
} from "@/lib/cover-letter-theme";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

type ClassicLetterTemplateProps = {
  data: CoverLetterFormData;
  theme?: CoverLetterTheme | null;
};

function RecipientBlock({
  data,
  lineStyle,
}: {
  data: CoverLetterFormData;
  lineStyle: { fontSize: number; lineHeight: number };
}) {
  const lines: string[] = [];
  if (data.recipientName?.trim()) lines.push(data.recipientName.trim());
  if (data.recipientTitle?.trim()) lines.push(data.recipientTitle.trim());
  if (data.company?.trim()) lines.push(data.company.trim());
  if (data.companyAddress?.trim()) {
    for (const line of data.companyAddress.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) lines.push(trimmed);
    }
  }

  if (lines.length === 0) return null;

  return (
    <View style={{ marginBottom: 16 }}>
      {lines.map((line) => (
        <Text key={line} style={lineStyle}>
          {line}
        </Text>
      ))}
    </View>
  );
}

export function ClassicLetterTemplate({
  data,
  theme = null,
}: ClassicLetterTemplateProps) {
  const resolved = getResolvedCoverLetterTheme(theme);
  const styles = createCoverLetterPdfStyles(resolved);
  const contactLines = buildCoverLetterContactLines(data);
  const paragraphs = splitCoverLetterBodyParagraphs(data.body);

  const title = data.company?.trim()
    ? `Cover letter — ${data.company.trim()}`
    : `Cover letter — ${data.fullName.trim()}`;

  return (
    <Document title={title}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.senderBlock}>
          {contactLines.map((line) => (
            <Text key={line} style={styles.senderLine}>
              {line}
            </Text>
          ))}
        </View>

        {data.letterDate?.trim() ? (
          <Text style={styles.date}>{data.letterDate.trim()}</Text>
        ) : null}

        <RecipientBlock
          data={data}
          lineStyle={{
            fontSize: resolved.senderFontSize,
            lineHeight: 1.4,
          }}
        />

        <Text style={styles.salutation}>{data.salutation.trim()}</Text>

        {paragraphs.map((paragraph) => (
          <Text key={paragraph} style={styles.bodyParagraph}>
            {paragraph}
          </Text>
        ))}

        <View style={styles.closingBlock}>
          <Text style={styles.closing}>{data.closing.trim()}</Text>
          <Text style={styles.signature}>{data.fullName.trim()}</Text>
        </View>
      </Page>
    </Document>
  );
}
