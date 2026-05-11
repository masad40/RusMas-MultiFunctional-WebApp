import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";
import type { AdminPhoto, AdminVideo } from "@/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "photo";

  const db = await getDb();
  const collection = type === "video" ? "videos" : "photos";
  const items = await db.collection(collection).find({}).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "photo";

  const body = await req.json() as AdminPhoto | AdminVideo;
  const db = await getDb();
  const collection = type === "video" ? "videos" : "photos";

  const { _id: _omit, ...rest } = body as AdminPhoto & AdminVideo & { _id?: unknown };
  void _omit;
  const doc = { ...rest, createdAt: new Date().toISOString() };
  const result = await db.collection(collection).insertOne(doc);

  return NextResponse.json({ ok: true, insertedId: result.insertedId }, { status: 201 });
}
