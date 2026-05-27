import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getDefaultBuiltResume,
  getResume,
  isBuiltResume,
  toResumeFormData,
} from "@/lib/resume";
import { generateResumePdf } from "@/lib/resume-pdf";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const resumeId = searchParams.get("resumeId");

  try {
    const resume = resumeId
      ? await getResume(userId, resumeId)
      : await getDefaultBuiltResume(userId);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found. Save a built resume first." },
        { status: 404 },
      );
    }

    if (!isBuiltResume(resume)) {
      return NextResponse.json(
        { error: "PDF download is only available for built resumes." },
        { status: 404 },
      );
    }

    const data = toResumeFormData(resume);
    const { buffer, filename } = await generateResumePdf(data);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate PDF.", message },
      { status: 500 },
    );
  }
}
