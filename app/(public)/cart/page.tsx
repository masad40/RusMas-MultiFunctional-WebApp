"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/components/shop/cart/CartProvider";

export default function CartPage() {
  const { lines, itemCount, subtotalCents, currency, setQuantity, removeFromCart, clearCart } =
    useCart();
  const rm = useReducedMotion();
  const dur = rm ? 0 : 0.32;

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
            Cart
          </p>
          <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
            Your selections
          </h1>
          <p className="mt-4 text-sm text-foreground-muted">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/shop"
            className="min-h-11 border border-border-subtle bg-surface/20 px-4 py-3 text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground uppercase"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="min-h-11 border border-border-subtle px-4 py-3 text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground uppercase"
            disabled={lines.length === 0}
          >
            Clear
          </button>
        </div>
      </motion.header>

      {lines.length === 0 ? (
        <div className="mt-14 border border-border-subtle bg-surface/15 px-5 py-8 text-sm text-foreground-muted">
          Your cart is empty. Browse the shop and add a few items.
        </div>
      ) : (
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <section className="grid gap-6">
            {lines.map((line) => (
              <article
                key={line.product.id}
                className="grid gap-5 border border-border-subtle bg-surface/15 p-4 sm:grid-cols-[120px_1fr] sm:items-start sm:p-6"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden border border-border-subtle bg-black/30 sm:aspect-square">
                  <Image
                    src={line.product.imageUrls[0]}
                    alt={line.product.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl text-foreground">
                        <Link
                          href={`/shop/${line.product.slug}`}
                          className="transition-colors hover:text-accent"
                        >
                          {line.product.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm text-foreground-muted">
                        {line.product.description}
                      </p>
                    </div>
                    <p className="text-sm tabular-nums text-foreground-muted">
                      {formatMoney(line.lineTotalCents, currency)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-[0.65rem] tracking-[0.2em] text-foreground-muted uppercase">
                      Qty
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={line.quantity}
                      onChange={(e) =>
                        setQuantity(line.product.id, Number(e.target.value))
                      }
                      className="h-11 w-24 border border-border-subtle bg-background/30 px-3 text-sm text-foreground outline-none focus:border-accent/60"
                    />
                    <button
                      type="button"
                      className="ml-auto min-h-11 border border-border-subtle px-4 py-3 text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground uppercase"
                      onClick={() => removeFromCart(line.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="border border-border-subtle bg-surface/15 p-5 sm:p-6">
            <h2 className="font-display text-2xl text-foreground">Summary</h2>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="tabular-nums text-foreground">
                {formatMoney(subtotalCents, currency)}
              </span>
            </div>
            <p className="mt-3 text-xs text-foreground-muted">
              Taxes and shipping are calculated at checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-8 inline-flex min-h-11 w-full items-center justify-center border border-accent/50 px-6 py-3 text-[0.68rem] tracking-[0.22em] text-foreground transition-colors hover:bg-accent hover:text-background uppercase"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

