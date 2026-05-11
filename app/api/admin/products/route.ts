import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";
import { ObjectId } from "mongodb";
import type { Product } from "@/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const db = await getDb();
  const products = await db.collection("products").find({}).toArray();
  return NextResponse.json({ ok: true, products });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const body = await req.json() as Omit<Product, "id">;
  const db = await getDb();

  const doc = {
    ...body,
    id: new ObjectId().toHexString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.collection("products").insertOne(doc);
  return NextResponse.json({ ok: true, insertedId: result.insertedId }, { status: 201 });
}
