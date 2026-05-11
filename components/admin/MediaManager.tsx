"use client";

import { useEffect, useState } from "react";
import type { AdminPhoto, AdminVideo, PhotoCategory } from "@/types";

type MediaType = "photo" | "video";

const PHOTO_CATEGORIES: PhotoCategory[] = ["wedding", "portrait", "event"];

const emptyPhoto: Omit<AdminPhoto, "_id" | "createdAt"> = {
  title: "",
  alt: "",
  src: "",
  category: "wedding",
  width: 1600,
  height: 1067,
};

const emptyVideo: Omit<AdminVideo, "_id" | "createdAt"> = {
  title: "",
  description: "",
  url: "",
  featured: false,
};

export function MediaManager() {
  const [tab, setTab] = useState<MediaType>("photo");
  const [items, setItems] = useState<(AdminPhoto | AdminVideo)[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState<Omit<AdminPhoto, "_id" | "createdAt">>(emptyPhoto);
  const [videoForm, setVideoForm] = useState<Omit<AdminVideo, "_id" | "createdAt">>(emptyVideo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load(type: MediaType) {
    setLoading(true);
    const res = await fetch(`/api/admin/media?type=${type}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => { load(tab); }, [tab]);

  function openCreate() {
    setPhotoForm(emptyPhoto);
    setVideoForm(emptyVideo);
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const body = tab === "photo" ? photoForm : videoForm;
      const res = await fetch(`/api/admin/media?type=${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      await load(tab);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/media/${id}?type=${tab}`, { method: "DELETE" });
    await load(tab);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">Assets</p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-foreground">Media</h1>
        </div>
        <button onClick={openCreate} className="btn-accent">+ Add {tab === "photo" ? "Photo" : "Video"}</button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2">
        {(["photo", "video"] as MediaType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-[0.65rem] tracking-widest uppercase border transition-colors ${
              tab === t
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-subtle text-foreground-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {t === "photo" ? "Photos" : "Videos"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-12 text-sm text-foreground-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-12 text-sm text-foreground-muted">No {tab}s yet.</p>
      ) : tab === "photo" ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items as AdminPhoto[]).map((p) => (
            <div key={p._id} className="border border-border-subtle bg-surface/15 group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="px-3 py-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-foreground">{p.title}</p>
                  <p className="text-xs text-foreground-muted">{p.category}</p>
                </div>
                <button onClick={() => handleDelete(p._id!)} className="text-xs text-red-400 hover:underline shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                {["Title", "URL", "Featured", ""].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs tracking-widest uppercase text-foreground-muted font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(items as AdminVideo[]).map((v) => (
                <tr key={v._id} className="border-b border-border-subtle hover:bg-surface/30 transition-colors">
                  <td className="py-3 pr-4 text-foreground">{v.title}</td>
                  <td className="py-3 pr-4 text-foreground-muted max-w-xs truncate">
                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{v.url}</a>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs tracking-widest uppercase ${v.featured ? "text-accent" : "text-foreground-muted"}`}>
                      {v.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(v._id!)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-background border border-border-subtle p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="font-display text-xl text-foreground mb-6">
              Add {tab === "photo" ? "Photo" : "Video"}
            </h2>

            {tab === "photo" ? (
              <div className="space-y-4">
                <Field label="Title">
                  <input className="admin-input" value={photoForm.title} onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })} />
                </Field>
                <Field label="Alt text">
                  <input className="admin-input" value={photoForm.alt} onChange={(e) => setPhotoForm({ ...photoForm, alt: e.target.value })} />
                </Field>
                <Field label="Image URL">
                  <input className="admin-input" value={photoForm.src} onChange={(e) => setPhotoForm({ ...photoForm, src: e.target.value })} />
                </Field>
                <Field label="Category">
                  <select className="admin-input" value={photoForm.category} onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as PhotoCategory })}>
                    {PHOTO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Width (px)">
                    <input type="number" className="admin-input" value={photoForm.width} onChange={(e) => setPhotoForm({ ...photoForm, width: Number(e.target.value) })} />
                  </Field>
                  <Field label="Height (px)">
                    <input type="number" className="admin-input" value={photoForm.height} onChange={(e) => setPhotoForm({ ...photoForm, height: Number(e.target.value) })} />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Title">
                  <input className="admin-input" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
                </Field>
                <Field label="Video URL (YouTube / Vimeo)">
                  <input className="admin-input" value={videoForm.url} onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })} />
                </Field>
                <Field label="Description">
                  <textarea rows={3} className="admin-input resize-none" value={videoForm.description ?? ""} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
                </Field>
                <Field label="Featured">
                  <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
                    <input type="checkbox" checked={videoForm.featured} onChange={(e) => setVideoForm({ ...videoForm, featured: e.target.checked })} className="accent-accent" />
                    Show as featured
                  </label>
                </Field>
              </div>
            )}

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
