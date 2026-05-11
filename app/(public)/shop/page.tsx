import type { Metadata } from "next";
import { ShopIndex } from "@/components/shop/ShopIndex";

export const metadata: Metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return <ShopIndex />;
}
