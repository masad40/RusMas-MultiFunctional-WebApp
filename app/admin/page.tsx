import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const cards = [
  { href: "/admin/products", label: "Products", desc: "Add, edit, delete products and manage stock." },
  { href: "/admin/orders", label: "Orders", desc: "View customer orders and update their status." },
  { href: "/admin/media", label: "Media", desc: "Upload and manage photos and videos." },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">Console</p>
      <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground">Dashboard</h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group border border-border-subtle bg-surface/20 px-5 py-6 hover:border-accent/40 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-accent">{c.label}</p>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
