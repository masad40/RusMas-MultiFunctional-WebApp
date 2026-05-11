"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/media", label: "Media" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border-subtle bg-surface/40 flex flex-col">
      <div className="px-5 py-6 border-b border-border-subtle">
        <p className="text-[0.6rem] tracking-[0.3em] text-accent uppercase">Console</p>
        <p className="mt-1 font-display text-lg text-foreground">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {links.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2 text-xs tracking-widest uppercase transition-colors ${
                active
                  ? "bg-accent/10 text-accent border-l-2 border-accent pl-[10px]"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface/60 border-l-2 border-transparent pl-[10px]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border-subtle">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full px-3 py-2 text-xs tracking-widest uppercase text-foreground-muted hover:text-foreground transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
