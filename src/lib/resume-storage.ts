import { del, get, put } from "@vercel/blob";
import { RESUME_UPLOAD_MIME } from "@/lib/resume-constants";

const STORAGE_PREFIX = "resumes";

function requireBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add it to .env for resume uploads.",
    );
  }
  return token;
}

function sanitizeFileName(fileName: string): string {
  const base = fileName.replace(/[/\\]/g, "").trim() || "resume.pdf";
  return base.replace(/[^\w.\-() ]+/g, "_").slice(0, 200);
}

export function buildResumeStorageKey(
  userId: string,
  resumeId: string,
  fileName: string,
): string {
  return `${STORAGE_PREFIX}/${userId}/${resumeId}/${sanitizeFileName(fileName)}`;
}

export async function uploadResumeFile(
  storageKey: string,
  body: Buffer | Blob,
  mimeType: string,
): Promise<void> {
  await put(storageKey, body, {
    access: "private",
    contentType: mimeType,
    token: requireBlobToken(),
    addRandomSuffix: false,
  });
}

export async function getResumeFileBuffer(storageKey: string): Promise<Buffer> {
  const result = await get(storageKey, {
    access: "private",
    token: requireBlobToken(),
  });
  if (!result || result.statusCode !== 200) {
    throw new Error("Resume file not found in storage.");
  }
  const bytes = await new Response(result.stream).arrayBuffer();
  return Buffer.from(bytes);
}

export async function deleteResumeFile(storageKey: string): Promise<void> {
  await del(storageKey, { token: requireBlobToken() });
}

export async function deleteAllUserResumeFiles(userId: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return;

  const { list } = await import("@vercel/blob");
  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: `${STORAGE_PREFIX}/${userId}/`,
      token,
      cursor,
    });

    if (page.blobs.length > 0) {
      await del(
        page.blobs.map((blob) => blob.url),
        { token },
      );
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}
