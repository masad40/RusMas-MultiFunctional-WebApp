import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb/client";
import { ObjectId } from "mongodb";
import type { OrderStatus } from "@/types";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();

  const { status } = await req.json() as { status: OrderStatus };
  const db = await getDb();

  const filter = ObjectId.isValid(params.id)
    ? { $or: [{ orderNumber: params.id }, { _id: new ObjectId(params.id) }] }
    : { orderNumber: params.id };

  await db.collection("orders").updateOne(
    filter,
    { $set: { status, updatedAt: new Date().toISOString() } },
  );

  return NextResponse.json({ ok: true });
}
