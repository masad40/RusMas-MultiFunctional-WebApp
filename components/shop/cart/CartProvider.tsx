"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem, Product } from "@/types";
import { shopProducts } from "@/lib/data/shop";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; productId: string; quantity?: number }
  | { type: "remove"; productId: string }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "clear" };

const CART_KEY = "rusmas.cart.v1";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const qty = Math.max(1, action.quantity ?? 1);
      const idx = state.items.findIndex((i) => i.productId === action.productId);
      if (idx === -1) return { items: [...state.items, { productId: action.productId, quantity: qty }] };
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: i.quantity + qty } : i,
        ),
      };
    }
    case "remove":
      return { items: state.items.filter((i) => i.productId !== action.productId) };
    case "setQty": {
      const qty = Math.max(0, Math.floor(action.quantity));
      if (qty <= 0) return { items: state.items.filter((i) => i.productId !== action.productId) };
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: qty } : i,
        ),
      };
    }
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartLine = {
  product: Product;
  quantity: number;
  lineTotalCents: number;
};

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  currency: string;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { items?: CartItem[] };
      if (Array.isArray(parsed.items)) dispatch({ type: "hydrate", items: parsed.items });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // ignore
    }
  }, [state.items]);

  const lines = useMemo((): CartLine[] => {
    return state.items
      .map((i) => {
        const product = shopProducts.find((p) => p.id === i.productId);
        if (!product) return null;
        const lineTotalCents = product.priceCents * i.quantity;
        return { product, quantity: i.quantity, lineTotalCents };
      })
      .filter(Boolean) as CartLine[];
  }, [state.items]);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
  );

  const currency = lines[0]?.product.currency ?? "USD";
  const subtotalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotalCents, 0),
    [lines],
  );

  const addToCart = useCallback((productId: string, quantity?: number) => {
    dispatch({ type: "add", productId, quantity });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "remove", productId });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "setQty", productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value: CartContextValue = {
    items: state.items,
    lines,
    itemCount,
    subtotalCents,
    currency,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

