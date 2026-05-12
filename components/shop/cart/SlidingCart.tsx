"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SlidingCart({ open, onClose }: Props) {
  const { lines, subtotalCents, currency, removeFromCart, setQuantity } = useCart();

  const whatsappCheckout = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
    if (!phone) {
      alert("WhatsApp checkout not configured");
      return;
    }

    const items = lines.map((l) => `${l.product.title} x${l.quantity}`).join("%0A");
    const total = formatMoney(subtotalCents, currency);
    const message = `Hi! I'd like to order:%0A%0A${items}%0A%0ATotal: ${total}`;
    const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border-subtle bg-black shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
              <h2 className="font-display text-2xl font-bold text-foreground">Cart</h2>
              <button
                onClick={onClose}
                className="text-foreground-muted transition-colors hover:text-gold"
                aria-label="Close cart"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <svg className="h-16 w-16 text-foreground-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="mt-4 text-sm text-foreground-muted">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {lines.map((line) => (
                    <motion.div
                      key={line.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border-subtle">
                        <Image
                          src={line.product.imageUrls[0]}
                          alt={line.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/shop/${line.product.slug}`}
                          onClick={onClose}
                          className="font-display text-base text-foreground transition-colors hover:text-gold"
                        >
                          {line.product.title}
                        </Link>
                        <p className="mt-1 text-sm tabular-nums text-foreground-muted">
                          {formatMoney(line.product.priceCents, line.product.currency)}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center border border-border-subtle text-foreground-muted transition-colors hover:border-gold hover:text-gold"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm tabular-nums text-foreground">{line.quantity}</span>
                            <button
                              onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center border border-border-subtle text-foreground-muted transition-colors hover:border-gold hover:text-gold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(line.product.id)}
                            className="text-xs tracking-widest uppercase text-red-400 transition-colors hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-border-subtle px-6 py-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm tracking-widest uppercase text-foreground-muted">Subtotal</span>
                  <span className="font-display text-2xl font-bold tabular-nums text-foreground">
                    {formatMoney(subtotalCents, currency)}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={whatsappCheckout}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden bg-green-600 px-6 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-all hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Checkout
                  </button>

                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full bg-gold px-6 py-4 text-center text-sm font-semibold tracking-widest text-black uppercase transition-all hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
