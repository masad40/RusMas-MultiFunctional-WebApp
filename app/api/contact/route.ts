import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/client";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function isValid(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" && b.name.trim().length > 0 &&
    typeof b.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.message === "string" && b.message.trim().length > 0
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ ok: false, message: "Please fill in all fields correctly." }, { status: 422 });
  }

  try {
    const db = await getDb();
    await db.collection("contact_messages").insertOne({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Could not save your message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Message received. We'll be in touch." });
}
