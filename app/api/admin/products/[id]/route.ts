import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";
import { ObjectId } from "mongodb";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

function buildFilter(id: string) {
  return ObjectId.isValid(id)
    ? { $or: [{ id }, { _id: new ObjectId(id) }] }
    : { id };
}

type Ctx = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const body = await req.json();
  const db = await getDb();

  const { _id, ...update } = body;
  void _id;

  await db.collection("products").updateOne(
    buildFilter(params.id),
    { $set: { ...update, updatedAt: new Date().toISOString() } },
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const db = await getDb();
  await db.collection("products").deleteOne(buildFilter(params.id));

  return NextResponse.json({ ok: true });
}
