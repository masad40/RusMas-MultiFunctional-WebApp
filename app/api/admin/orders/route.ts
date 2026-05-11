import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const db = await getDb();
  const filter = status ? { status } : {};
  const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({ ok: true, orders });
}
