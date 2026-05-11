export type NavItem = {
  href: string;
  label: string;
};

export interface MediaProject {
  id: string;
  slug: string;
  title: string;
  medium: "photo" | "video";
  synopsis?: string;
  coverSrc?: string;
  year?: number;
}

export type PhotoCategory = "wedding" | "portrait" | "event";

export interface GalleryImage {
  id: string;
  category: PhotoCategory;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
}

export interface VideographyEntry {
  id: string;
  title: string;
  description?: string;
  url: string;
  featured?: boolean;
}

export type ShopCategory = "mobile-cases" | "earphones" | "t-shirts" | "accessories";

export interface Product {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  category: ShopCategory;
  imageUrls: string[];
  description: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

// ── Admin / Orders ────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  priceCents: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  orderNumber: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  subtotalCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// ── Media (admin-managed gallery / video entries) ─────────────────────────────

export interface AdminPhoto {
  _id?: string;
  title: string;
  alt: string;
  src: string;
  category: PhotoCategory;
  width: number;
  height: number;
  createdAt: string;
}

export interface AdminVideo {
  _id?: string;
  title: string;
  description?: string;
  url: string;
  featured: boolean;
  createdAt: string;
}
