"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const { addToCart } = useCart();
  const rm = useReducedMotion();

  return (
    <motion.button
      type="button"
      className="min-h-11 border border-accent/50 px-6 py-3 text-[0.68rem] tracking-[0.22em] text-foreground transition-colors hover:bg-accent hover:text-background uppercase disabled:cursor-not-allowed disabled:opacity-50"
      whileHover={rm ? undefined : { y: -2 }}
      whileTap={rm ? undefined : { scale: 0.98 }}
      onClick={() => addToCart(productId, 1)}
      disabled={disabled}
    >
      Add to cart
    </motion.button>
  );
}

