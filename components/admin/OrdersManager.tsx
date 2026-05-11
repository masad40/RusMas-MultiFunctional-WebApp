"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types";
import { formatMoney } from "@/lib/format";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<OrderStatus, string> = {
  pending: "text-yellow-400",
  processing: "text-blue-400",
  shipped: "text-purple-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  async function load(status?: string) {
    setLoading(true);
    const qs = status && status !== "all" ? `?status=${status}` : "";
    const res = await fetch(`/api/admin/orders${qs}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => { load(filter); }, [filter]);

  async function updateStatus(order: Order, status: OrderStatus) {
    setUpdating(true);
    const id = order.orderNumber ?? order._id;
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    setSelected(null);
    await load(filter);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">Commerce</p>
      <h1 className="font-display mt-2 text-3xl tracking-tight text-foreground">Orders</h1>

      {/* Status filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-[0.65rem] tracking-widest uppercase border transition-colors ${
              filter === s
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-subtle text-foreground-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-12 text-sm text-foreground-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-12 text-sm text-foreground-muted">No orders found.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id ?? o.orderNumber} className="border-b border-border-subtle hover:bg-surface/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-foreground">{o.orderNumber}</td>
                  <td className="py-3 pr-4 text-foreground">
                    <div>{o.customer.name}</div>
                    <div className="text-xs text-foreground-muted">{o.customer.email}</div>
                  </td>
                  <td className="py-3 pr-4 text-foreground-muted">{o.items.length}</td>
                  <td className="py-3 pr-4 tabular-nums text-foreground-muted">{formatMoney(o.subtotalCents, o.currency)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs tracking-widest uppercase ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-foreground-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => setSelected(o)} className="text-xs text-accent hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-background border border-border-subtle p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="font-display text-xl text-foreground mb-1">Order {selected.orderNumber}</h2>
            <p className={`text-xs tracking-widest uppercase mb-6 ${statusColors[selected.status]}`}>{selected.status}</p>

            <section className="mb-5">
              <p className="text-xs tracking-widest uppercase text-foreground-muted mb-2">Customer</p>
              <p className="text-sm text-foreground">{selected.customer.name}</p>
              <p className="text-sm text-foreground-muted">{selected.customer.email}</p>
              {selected.customer.phone && <p className="text-sm text-foreground-muted">{selected.customer.phone}</p>}
              {selected.customer.address && <p className="text-sm text-foreground-muted">{selected.customer.address}</p>}
            </section>

            <section className="mb-5">
              <p className="text-xs tracking-widest uppercase text-foreground-muted mb-2">Items</p>
              <ul className="space-y-1">
                {selected.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.title} × {item.quantity}</span>
                    <span className="tabular-nums text-foreground-muted">{formatMoney(item.priceCents * item.quantity, selected.currency)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between text-sm border-t border-border-subtle pt-3">
                <span className="text-foreground-muted">Total</span>
                <span className="tabular-nums text-foreground">{formatMoney(selected.subtotalCents, selected.currency)}</span>
              </div>
            </section>

            <section>
              <p className="text-xs tracking-widest uppercase text-foreground-muted mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={updating || s === selected.status}
                    onClick={() => updateStatus(selected, s)}
                    className={`px-3 py-1.5 text-[0.65rem] tracking-widest uppercase border transition-colors disabled:opacity-40 ${
                      s === selected.status
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-subtle text-foreground-muted hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="btn-ghost">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
