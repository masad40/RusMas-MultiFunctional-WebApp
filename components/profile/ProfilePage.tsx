"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load user data from MongoDB
    async function loadUser() {
      if (!user) return;
      
      try {
        const res = await fetch(`/api/users?uid=${user.uid}`);
        const data = await res.json();
        if (data.ok && data.user) {
          setName(data.user.name || "");
          setImageUrl(data.user.imageUrl || "");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    loadUser();
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          name,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message);

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16">
      <p className="text-[0.65rem] tracking-[0.4em] text-gold uppercase">Account</p>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        {/* Profile Image Preview */}
        {imageUrl && (
          <div className="flex justify-center">
            <Image
              src={imageUrl}
              alt={name}
              width={120}
              height={120}
              className="h-30 w-30 rounded-full border-2 border-gold/30 object-cover"
            />
          </div>
        )}

        <div>
          <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
            Email
          </label>
          <input
            type="email"
            disabled
            value={user.email || ""}
            className="admin-input opacity-50 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-foreground-muted">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-foreground-muted mb-1.5">
            Profile Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="admin-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-green-400">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-accent"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
