import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";
import { ObjectId } from "mongodb";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

type Ctx = { params: { id: string } };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "photo";

  const db = await getDb();
  const collection = type === "video" ? "videos" : "photos";

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  await db.collection(collection).deleteOne({ _id: new ObjectId(params.id) });

  return NextResponse.json({ ok: true });
}
