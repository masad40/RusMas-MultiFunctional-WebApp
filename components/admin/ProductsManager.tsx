"use client";

import { useEffect, useState } from "react";
import type { Product, ShopCategory } from "@/types";
import { formatMoney } from "@/lib/format";

const CATEGORIES: ShopCategory[] = ["mobile-cases", "earphones", "t-shirts", "accessories"];

const empty: Omit<Product, "id"> = {
  slug: "",
  title: "",
  category: "accessories",
  priceCents: 0,
  currency: "USD",
  imageUrls: [""],
  description: "",
  inStock: true,
};

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    const { id: _id, ...rest } = p;
    void _id;
    setForm(rest);
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        imageUrls: form.imageUrls.filter(Boolean),
        priceCents: Number(form.priceCents),
      };
      const res = editing
        ? await fetch(`/api/admin/products/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      await load();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">Inventory</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-foreground">Products</h1>
        </div>
        <button onClick={openCreate} className="btn-accent">+ Add Product</button>
      </div>

      {loading ? (
        <p className="mt-12 text-sm text-foreground-muted">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-12 text-sm text-foreground-muted">No products yet.</p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">Title</th>
                <th className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">Category</th>
                <th className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">Price</th>
                <th className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">Stock</th>
                <th className="pb-3 text-xs tracking-widest uppercase text-foreground-muted font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-surface/30 transition-colors">
                  <td className="py-3 pr-4 text-foreground">{p.title}</td>
                  <td className="py-3 pr-4 text-foreground-muted">{p.category}</td>
                  <td className="py-3 pr-4 tabular-nums text-foreground-muted">{formatMoney(p.priceCents, p.currency)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs tracking-widest uppercase ${p.inStock ? "text-green-400" : "text-red-400"}`}>
                      {p.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="py-3 flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-xs text-accent hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-background border border-border-subtle p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="font-display text-xl text-foreground mb-6">
              {editing ? "Edit Product" : "New Product"}
            </h2>

            <div className="space-y-4">
              <Field label="Title">
                <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Slug">
                <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </Field>
              <Field label="Category">
                <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ShopCategory })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (cents)">
                  <input type="number" className="admin-input" value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} />
                </Field>
                <Field label="Currency">
                  <input className="admin-input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
                </Field>
              </div>
              <Field label="Image URL">
                <input className="admin-input" value={form.imageUrls[0] ?? ""} onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })} />
              </Field>
              <Field label="Description">
                <textarea rows={3} className="admin-input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <Field label="Stock">
                <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-accent" />
                  In Stock
                </label>
              </Field>
            </div>

            {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-accent">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}
