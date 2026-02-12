import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, company, budgetRange, campaignType, timeline, message } = body;

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For now, log the inquiry. In production, send an email via Resend
    // and/or write to a database.
    console.log("New brand inquiry:", {
      name,
      email,
      company,
      budgetRange,
      campaignType,
      timeline,
      message,
      date: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
