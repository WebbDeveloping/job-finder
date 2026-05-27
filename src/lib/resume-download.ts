import { getResumeFileApiUrl } from "@/lib/resume-types";

export async function downloadResumeFile(
  resumeId: string,
  kind: "BUILT" | "UPLOADED",
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
  const filename = filenameMatch?.[1] ?? "resume.pdf";

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
