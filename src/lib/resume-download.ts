import { getResumeFileApiUrl } from "@/lib/resume-types";

function sanitizeFilenameBase(value: string): string {
  const safe = value
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");
  return safe || "resume";
}

export async function downloadResumeFile(
  resumeId: string,
  kind: "BUILT" | "UPLOADED",
  preferredLabel?: string,
): Promise<void> {
  const response = await fetch(getResumeFileApiUrl(resumeId, kind));
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Download failed.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filenameMatch = disposition?.match(/filename="([^"]+)"/);
  const headerFilename = filenameMatch?.[1] ?? "resume.pdf";
  const extensionMatch = headerFilename.match(/(\.[A-Za-z0-9]+)$/);
  const extension = extensionMatch?.[1] ?? ".pdf";
  const filename = preferredLabel?.trim()
    ? `${sanitizeFilenameBase(preferredLabel)}${extension}`
    : headerFilename;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
