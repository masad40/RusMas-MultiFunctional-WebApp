"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/components/shop/cart/CartProvider";

type PaymentMethod = "stripe" | "paypal" | "cod";

const methodLabel: Record<PaymentMethod, string> = {
  stripe: "Stripe",
  paypal: "PayPal",
  cod: "Cash on Delivery",
};

export default function CheckoutPage() {
  const rm = useReducedMotion();
  const dur = rm ? 0 : 0.32;

  const { lines, subtotalCents, currency, clearCart } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("stripe");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const disabled = lines.length === 0 || status === "processing";

  const orderSummary = useMemo(() => {
    return lines.map((l) => `${l.quantity}× ${l.product.title}`).join(", ");
  }, [lines]);

  async function submit() {
    setMessage(null);
    if (lines.length === 0) return;

    if (method === "cod") {
      setStatus("done");
      setMessage("Order placed. Pay on delivery.");
      clearCart();
      return;
    }

    try {
      setStatus("processing");
      const res = await fetch(`/api/checkout/${method}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currency,
          subtotalCents,
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) throw new Error(data.message ?? "Checkout failed");

      setStatus("done");
      setMessage(data.message ?? "Checkout request created (stub).");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Checkout failed");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <motion.header
        initial={{ opacity: rm ? 1 : 0, y: rm ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
            Checkout
          </p>
          <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
            Finalize order
          </h1>
          <p className="mt-4 text-sm text-foreground-muted">
            {lines.length === 0
              ? "Your cart is empty."
              : `Subtotal: ${formatMoney(subtotalCents, currency)}`}
          </p>
        </div>
        <Link
          href="/cart"
          className="min-h-11 border border-border-subtle bg-surface/20 px-4 py-3 text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground uppercase"
        >
          ← Back to cart
        </Link>
      </motion.header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <section className="border border-border-subtle bg-surface/15 p-5 sm:p-6">
          <h2 className="font-display text-2xl text-foreground">Payment</h2>
          <p className="mt-3 text-sm text-foreground-muted">
            Choose a method. Stripe and PayPal are scaffolded (API stubs) so you
            can plug in real credentials later.
          </p>

          <div className="mt-7 grid gap-3">
            {(["stripe", "paypal", "cod"] as const).map((m) => {
              const active = m === method;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`min-h-11 border px-4 py-3 text-left text-[0.7rem] tracking-[0.2em] uppercase transition-colors ${
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border-subtle text-foreground-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {methodLabel[m]}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-8 inline-flex min-h-11 w-full items-center justify-center border border-accent/50 px-6 py-3 text-[0.68rem] tracking-[0.22em] text-foreground transition-colors hover:bg-accent hover:text-background uppercase disabled:cursor-not-allowed disabled:opacity-50"
            onClick={submit}
            disabled={disabled}
          >
            {status === "processing" ? "Processing…" : `Pay with ${methodLabel[method]}`}
          </button>

          {message ? (
            <div className="mt-6 border border-border-subtle bg-background/20 px-4 py-3 text-sm text-foreground-muted">
              {message}
            </div>
          ) : null}
        </section>

        <aside className="border border-border-subtle bg-surface/15 p-5 sm:p-6">
          <h2 className="font-display text-2xl text-foreground">Order</h2>
          <p className="mt-4 text-sm text-foreground-muted">
            {lines.length === 0 ? (
              <>
                Add products first.{" "}
                <Link href="/shop" className="text-accent underline">
                  Go to shop
                </Link>
                .
              </>
            ) : (
              orderSummary
            )}
          </p>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Subtotal</span>
            <span className="tabular-nums text-foreground">
              {formatMoney(subtotalCents, currency)}
            </span>
          </div>
          <p className="mt-3 text-xs text-foreground-muted">
            This scaffold does not calculate shipping/tax yet.
          </p>
        </aside>
      </div>
    </main>
  );
}

