"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      const callbackUrl = params.get("callbackUrl") ?? "/admin";
      router.push(callbackUrl);
    } else {
      setError("Invalid credentials.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Console
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs tracking-widest text-foreground-muted uppercase mb-1.5">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-border-subtle px-4 py-2.5 text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest text-foreground-muted uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border-subtle px-4 py-2.5 text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black text-xs tracking-widest uppercase py-3 font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
