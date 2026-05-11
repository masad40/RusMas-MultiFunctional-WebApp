import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "PayPal checkout is scaffolded. Add PayPal credentials and create an order here.",
    },
    { status: 501 },
  );
}

