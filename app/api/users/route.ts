import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, name, email, phone, imageUrl, role } = body;

    if (!uid) {
      return NextResponse.json(
        { ok: false, message: "UID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if user already exists
    const existing = await db.collection("users").findOne({ uid });
    if (existing) {
      return NextResponse.json({ ok: true, message: "User already exists" });
    }

    // Create new user
    const result = await db.collection("users").insertOne({
      uid,
      name: name || "",
      email: email || "",
      phone: phone || "",
      imageUrl: imageUrl || "",
      role: role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true, message: "User created", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ ok: false, message: "UID required" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ uid });

    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, name, imageUrl } = body;

    if (!uid) {
      return NextResponse.json({ ok: false, message: "UID required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("users").updateOne(
      { uid },
      {
        $set: {
          name,
          imageUrl,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
