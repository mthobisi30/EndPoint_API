import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.data || typeof body.data !== "string") {
      return NextResponse.json(
        { error: "Invalid request. Expected { data: string }" },
        { status: 400 }
      );
    }

    const characters = body.data.split("");
    const sorted = characters.sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ word: sorted });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}