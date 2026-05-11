import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Stripe checkout is scaffolded. Add STRIPE_SECRET_KEY and create a checkout session here.",
    },
    { status: 501 },
  );
}

