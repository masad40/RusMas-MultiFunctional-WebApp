"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./shop/cart/CartProvider";
import { SlidingCart } from "./shop/cart/SlidingCart";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/photography", label: "Photography" },
  { href: "/videography", label: "Videography" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-subtle/80 backdrop-blur-md bg-black/75">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-[0.2em] text-foreground uppercase"
          >
            Rusmas
          </Link>
          <nav className="flex items-center gap-1 sm:gap-6" aria-label="Primary">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.65rem] sm:text-xs tracking-[0.18em] text-foreground-muted transition-colors hover:text-gold uppercase"
              >
                {item.label}
              </Link>
            ))}
            
            {/* User menu */}
            {user ? (
              <button
                onClick={() => signOut()}
                className="ml-2 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground-muted transition-colors hover:text-gold uppercase"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-2 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground-muted transition-colors hover:text-gold uppercase"
              >
                Login
              </Link>
            )}

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative ml-2 border border-border-subtle px-3 py-1.5 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground-muted transition-colors hover:border-gold hover:text-gold uppercase"
              aria-label={`Cart with ${itemCount} items`}
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-gold text-[0.6rem] font-bold text-black">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <SlidingCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
