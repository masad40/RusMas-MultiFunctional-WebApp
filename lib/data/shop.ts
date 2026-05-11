import type { Product, ShopCategory } from "@/types";

export const shopCategoryLabels: Record<ShopCategory, string> = {
  "mobile-cases": "Mobile Cases",
  earphones: "Earphones",
  "t-shirts": "T-Shirts",
  accessories: "Accessories",
};

/** Static catalog for now — replace with MongoDB later. */
export const shopProducts: readonly Product[] = [
  {
    id: "case-obsidian-1",
    slug: "obsidian-case",
    title: "Obsidian Case",
    category: "mobile-cases",
    priceCents: 1900,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Matte-black protection with a thin profile and a gold accent edge.",
    inStock: true,
  },
  {
    id: "case-aurum-2",
    slug: "aurum-trim-case",
    title: "Aurum Trim Case",
    category: "mobile-cases",
    priceCents: 2400,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Shock-absorbing case with subtle gold detailing and camera lift.",
    inStock: true,
  },
  {
    id: "ear-noir-1",
    slug: "noir-earphones",
    title: "Noir Earphones",
    category: "earphones",
    priceCents: 4900,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1518441902117-f0a0e9e2c0f9?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Balanced sound with clean lows, tuned for late-night edits and travel.",
    inStock: true,
  },
  {
    id: "ear-aurum-2",
    slug: "aurum-wireless-earbuds",
    title: "Aurum Wireless Earbuds",
    category: "earphones",
    priceCents: 8900,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1585386959984-a41552231693?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Compact wireless earbuds with warm mids and a minimal charging case.",
    inStock: false,
  },
  {
    id: "tee-black-1",
    slug: "studio-t-shirt-black",
    title: "Studio T‑Shirt (Black)",
    category: "t-shirts",
    priceCents: 3200,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1520975958225-0a3b76a0c2bf?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Heavyweight cotton, relaxed fit. Designed for long shoots and clean silhouettes.",
    inStock: true,
  },
  {
    id: "tee-white-2",
    slug: "studio-t-shirt-white",
    title: "Studio T‑Shirt (White)",
    category: "t-shirts",
    priceCents: 3200,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1520975867597-0f26d05a1d4b?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Minimal print, crisp fabric. A bright counterpoint to a dark kit.",
    inStock: true,
  },
  {
    id: "acc-strap-1",
    slug: "camera-strap-aurum",
    title: "Camera Strap — Aurum",
    category: "accessories",
    priceCents: 3900,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1519183071298-a2962be96f8d?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Soft-touch strap with reinforced stitching and a subtle gold stitch line.",
    inStock: true,
  },
  {
    id: "acc-pouch-2",
    slug: "gear-pouch-noir",
    title: "Gear Pouch — Noir",
    category: "accessories",
    priceCents: 2700,
    currency: "USD",
    imageUrls: [
      "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=1600&q=85&auto=format&fit=crop",
    ],
    description:
      "Compact organizer for cards, batteries, and small adapters—kept understated.",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return shopProducts.find((p) => p.slug === slug);
}

