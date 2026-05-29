import { getCoverLetterPdfApiUrl } from "@/lib/cover-letter-types";

function sanitizeFilenameBase(value: string): string {
  const safe = value
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");
  return safe || "cover_letter";
}

export async function downloadCoverLetterPdf(
  coverLetterId: string,
  preferredLabel?: string,
): Promise<void> {
  const response = await fetch(getCoverLetterPdfApiUrl(coverLetterId));
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Download failed.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filenameMatch = disposition?.match(/filename="([^"]+)"/);
  const headerFilename = filenameMatch?.[1] ?? "cover_letter.pdf";
  const filename = preferredLabel?.trim()
    ? `${sanitizeFilenameBase(preferredLabel)}.pdf`
    : headerFilename;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
