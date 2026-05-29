import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCoverLetter,
  toCoverLetterFormData,
  toCoverLetterThemeFromRow,
} from "@/lib/cover-letter";
import { generateCoverLetterPdf } from "@/lib/cover-letter-pdf";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const coverLetterId = searchParams.get("coverLetterId");

  if (!coverLetterId?.trim()) {
    return NextResponse.json(
      { error: "coverLetterId is required." },
      { status: 400 },
    );
  }

  try {
    const letter = await getCoverLetter(userId, coverLetterId.trim());
    if (!letter) {
      return NextResponse.json(
        { error: "Cover letter not found." },
        { status: 404 },
      );
    }

    const data = toCoverLetterFormData(letter);
    const theme = toCoverLetterThemeFromRow(letter);
    const { buffer, filename } = await generateCoverLetterPdf(data, theme);

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
