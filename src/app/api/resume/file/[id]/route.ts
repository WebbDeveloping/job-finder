import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResume, isUploadedResume } from "@/lib/resume";
import { getResumeFileBuffer } from "@/lib/resume-storage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const resume = await getResume(userId, id);
    if (!resume || !isUploadedResume(resume) || !resume.storageKey) {
      return NextResponse.json({ error: "Resume file not found." }, { status: 404 });
    }

    const buffer = await getResumeFileBuffer(resume.storageKey);
    const fileName = resume.fileName ?? "resume.pdf";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": resume.mimeType ?? "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to download file.", message },
      { status: 500 },
    );
  }
}
