"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCart } from "./shop/cart/CartProvider";
import { SlidingCart } from "./shop/cart/SlidingCart";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/photography", label: "Photography" },
  { href: "/videography", label: "Videography" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
  };

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
            
            {/* Profile dropdown */}
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-110"
                  aria-label="Profile menu"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-gold/50 object-cover transition-all duration-300 hover:border-gold"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold/50 bg-gold/10 transition-all duration-300 hover:border-gold hover:bg-gold/20">
                      <svg className="h-5 w-5 text-gold transition-transform duration-300 hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 border border-border-subtle bg-black shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-b border-border-subtle px-4 py-3">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-xs text-gold/80 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-gold/10 hover:text-gold group"
                      >
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-gold/10 hover:text-gold group"
                      >
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition-all hover:bg-red-500/10 hover:text-red-400 group"
                      >
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 flex items-center gap-2 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground transition-all duration-300 hover:text-gold hover:scale-105 uppercase"
              >
                <svg className="h-4 w-4 transition-transform duration-300 hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Login
              </Link>
            )}

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative ml-2 border border-border-subtle px-3 py-1.5 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground transition-all duration-300 hover:border-gold hover:text-gold hover:scale-105 uppercase group"
              aria-label={`Cart with ${itemCount} items`}
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Cart
              </span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-gold text-[0.6rem] font-bold text-black animate-pulse">
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
