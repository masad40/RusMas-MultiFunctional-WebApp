import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/client";

export async function GET() {
  try {
    const db = await getDb();
    
    // Test the connection by running a ping command
    await db.admin().ping();
    
    // Get database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      ok: true,
      message: "MongoDB connected successfully!",
      database: db.databaseName,
      collections: stats.collections,
      dataSize: stats.dataSize,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
