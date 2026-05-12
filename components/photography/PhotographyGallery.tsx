"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categoryLabels, photographyGallery } from "@/lib/data/photography";
import type { PhotoCategory } from "@/types";
import { GalleryLightbox } from "./GalleryLightbox";

type FilterOption = PhotoCategory | "all";
type LayoutMode = "grid" | "masonry";

export function PhotographyGallery() {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.34;

  const [filter, setFilter] = useState<FilterOption>("all");
  const [layout, setLayout] = useState<LayoutMode>("masonry");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return [...photographyGallery];
    return photographyGallery.filter((item) => item.category === filter);
  }, [filter]);

  useEffect(() => {
    setLightboxIndex(null);
  }, [filter]);

  const chips: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All" },
    { key: "wedding", label: categoryLabels.wedding },
    { key: "portrait", label: categoryLabels.portrait },
    { key: "event", label: categoryLabels.event },
  ];

  const openPhoto = (id: string) => {
    const i = filtered.findIndex((photo) => photo.id === id);
    if (i !== -1) setLightboxIndex(i);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    setLightboxIndex((i) =>
      i === null || filtered.length === 0
        ? null
        : (i - 1 + filtered.length) % filtered.length,
    );
  };

  const goNext = () => {
    setLightboxIndex((i) =>
      i === null || filtered.length === 0 ? null : (i + 1) % filtered.length,
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <motion.header
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <p className="text-[0.65rem] tracking-[0.4em] text-gold uppercase">
          Portfolio
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Photography
        </h1>
        <p className="mt-6 text-base leading-relaxed text-foreground-muted">
          Cinematic moments captured with precision. Filter by category and explore in full-screen lightbox.
        </p>
      </motion.header>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration, delay: 0.2 }}
        >
          {chips.map((chip) => {
            const active = chip.key === filter;
            return (
              <motion.button
                key={chip.key}
                type="button"
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                className={`px-6 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase transition-all ${
                  active
                    ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "border border-border-subtle text-foreground-muted hover:border-gold/50 hover:text-gold"
                }`}
                onClick={() => setFilter(chip.key)}
              >
                {chip.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Layout toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 transition-colors ${layout === "grid" ? "text-gold" : "text-foreground-muted hover:text-gold"}`}
            aria-label="Grid layout"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </button>
          <button
            onClick={() => setLayout("masonry")}
            className={`p-2 transition-colors ${layout === "masonry" ? "text-gold" : "text-foreground-muted hover:text-gold"}`}
            aria-label="Masonry layout"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v5H3V3zm10 0h8v8h-8V3zM3 10h8v11H3V10zm10 5h8v6h-8v-6z" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Gallery */}
      {layout === "masonry" ? (
        <motion.div layout className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, idx) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                className="group relative mb-4 cursor-pointer overflow-hidden break-inside-avoid"
                onClick={() => openPhoto(photo.id)}
              >
                <div className="relative">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="w-full transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-5 transition-transform duration-500 group-hover:translate-y-0">
                    <p className="text-[0.6rem] tracking-[0.3em] uppercase text-gold">{categoryLabels[photo.category]}</p>
                    <p className="font-display mt-1 text-xl text-white">{photo.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, idx) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
              >
                <button
                  type="button"
                  className="group relative aspect-[4/5] w-full overflow-hidden border border-border-subtle bg-surface/20 text-left transition-all hover:border-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                  onClick={() => openPhoto(photo.id)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 px-5 pb-5">
                    <span className="block text-[0.6rem] tracking-[0.3em] text-gold uppercase">
                      {categoryLabels[photo.category]}
                    </span>
                    <span className="font-display block text-xl text-white transition-transform duration-700 group-hover:-translate-y-1">
                      {photo.title}
                    </span>
                  </span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <GalleryLightbox
        items={filtered}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
      />
    </main>
  );
}
