"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadUser() {
      if (!user) return;
      
      try {
        const res = await fetch(`/api/users?uid=${user.uid}`);
        const data = await res.json();
        if (data.ok && data.user) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [user, router]);

  if (!user || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-foreground-muted">Loading...</p>
      </main>
    );
  }

  const isAdmin = userData?.role === "admin";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
      <p className="text-[0.65rem] tracking-[0.4em] text-gold uppercase">Welcome</p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        {userData?.name || user.email}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Link
          href="/profile"
          className="group border border-border-subtle bg-surface/20 px-6 py-8 transition-all hover:border-gold/40 hover:bg-surface/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-8 w-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <p className="text-xs tracking-widest uppercase text-gold">Profile</p>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            Update your name and profile image
          </p>
        </Link>

        {/* Orders Card */}
        <Link
          href="/orders"
          className="group border border-border-subtle bg-surface/20 px-6 py-8 transition-all hover:border-gold/40 hover:bg-surface/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-8 w-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xs tracking-widest uppercase text-gold">Orders</p>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            View your order history
          </p>
        </Link>

        {/* Admin Panel (only for admins) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="group border border-gold/30 bg-gold/5 px-6 py-8 transition-all hover:border-gold hover:bg-gold/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <svg className="h-8 w-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xs tracking-widest uppercase text-gold">Admin Panel</p>
            <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
              Manage products, photos, and videos
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
