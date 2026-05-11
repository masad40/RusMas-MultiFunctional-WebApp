"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { shopCategoryLabels, shopProducts } from "@/lib/data/shop";
import type { ShopCategory } from "@/types";
import { ProductCard } from "./ProductCard";

type CategoryFilter = ShopCategory | "all";

const chipBase =
  "min-h-11 rounded-full border px-5 py-2 text-[0.65rem] tracking-[0.26em] transition-colors uppercase";

export function ShopIndex() {
  const rm = useReducedMotion();
  const dur = rm ? 0 : 0.32;

  const [filter, setFilter] = useState<CategoryFilter>("all");

  const products = useMemo(() => {
    if (filter === "all") return [...shopProducts];
    return shopProducts.filter((p) => p.category === filter);
  }, [filter]);

  const chips: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "mobile-cases", label: shopCategoryLabels["mobile-cases"] },
    { key: "earphones", label: shopCategoryLabels.earphones },
    { key: "t-shirts", label: shopCategoryLabels["t-shirts"] },
    { key: "accessories", label: shopCategoryLabels.accessories },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <motion.header
        initial={{ opacity: rm ? 1 : 0, y: rm ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur }}
        className="max-w-3xl"
      >
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Commerce
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
          Shop
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
          Mobile Cases, Earphones, T‑Shirts, and Accessories — designed to match
          the cinematic palette. Add items to cart and checkout via Stripe,
          PayPal, or cash on delivery.
        </p>
      </motion.header>

      <motion.div
        className="mt-10 flex flex-wrap gap-3"
        initial={{ opacity: rm ? 1 : 0, y: rm ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur, delay: rm ? 0 : 0.06 }}
        role="tablist"
        aria-label="Product categories"
      >
        {chips.map((chip, idx) => {
          const active = chip.key === filter;
          return (
            <motion.button
              key={chip.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${chipBase} ${
                active
                  ? "border-accent bg-accent/10 text-foreground shadow-[0_10px_40px_-10px_rgba(212,175,55,0.45)]"
                  : "border-border-subtle bg-surface/20 text-foreground-muted hover:border-accent/40 hover:text-foreground"
              }`}
              initial={{ opacity: rm ? 1 : 0, scale: rm ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: dur, delay: rm ? 0 : idx * 0.03 }}
              whileHover={rm ? undefined : { y: -3 }}
              whileTap={rm ? undefined : { scale: 0.98 }}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: rm ? 1 : 0, y: rm ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: rm ? 1 : 0, y: rm ? 0 : -10 }}
              transition={{ duration: dur, delay: rm ? 0 : Math.min(idx, 8) * 0.03 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

