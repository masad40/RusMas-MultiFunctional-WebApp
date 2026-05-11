import type { Metadata } from "next";
import { OrdersManager } from "@/components/admin/OrdersManager";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return <OrdersManager />;
}
