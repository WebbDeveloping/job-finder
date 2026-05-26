import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumeProfile, toResumeFormData } from "@/lib/resume";
import { generateResumePdf } from "@/lib/resume-pdf";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getResumeProfile(userId);
    if (!profile) {
      return NextResponse.json(
        { error: "No saved resume profile. Save your resume first." },
        { status: 404 },
      );
    }

    const data = toResumeFormData(profile);
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
