"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categoryLabels, photographyGallery } from "@/lib/data/photography";
import type { PhotoCategory } from "@/types";
import { GalleryLightbox } from "./GalleryLightbox";

type FilterOption = PhotoCategory | "all";

export function PhotographyGallery() {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.34;

  const [filter, setFilter] = useState<FilterOption>("all");
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <motion.header
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
        className="max-w-2xl"
      >
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Still
        </p>
        <h1 className="font-display mt-3 text-3xl tracking-tight text-foreground sm:text-4xl">
          Photography
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
          Filter by commissioning lane, tap to open full screen with scroll zoom,
          arrows, pinch-friendly pan, and tactile controls tuned for handheld
          previews.
        </p>
      </motion.header>

      <motion.div
        className="mt-10 flex flex-wrap gap-3"
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.06 }}
        role="tablist"
        aria-label="Gallery categories"
      >
        {chips.map((chip, idx) => {
          const active = chip.key === filter;
          return (
            <motion.button
              key={chip.key}
              layout
              type="button"
              role="tab"
              aria-selected={active}
              id={`photography-tab-${chip.key}`}
              className={`min-h-11 rounded-full border px-5 py-2 text-[0.65rem] tracking-[0.26em] transition-colors uppercase ${
                active
                  ? "border-accent bg-accent/10 text-foreground shadow-[0_10px_40px_-10px_rgba(212,175,55,0.45)]"
                  : "border-border-subtle bg-surface/20 text-foreground-muted hover:border-accent/40 hover:text-foreground"
              }`}
              transition={{ duration, delay: prefersReducedMotion ? 0 : idx * 0.04 }}
              initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: prefersReducedMotion ? 0 : -3 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              onClick={() => setFilter(chip.key)}
            >
              {chip.label}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              layout
              role="group"
              initial={{
                opacity: prefersReducedMotion ? 1 : 0,
                y: prefersReducedMotion ? 0 : 18,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: prefersReducedMotion ? 1 : 0,
                y: prefersReducedMotion ? 0 : -12,
              }}
              transition={{
                duration,
                delay: prefersReducedMotion ? 0 : Math.min(idx, 10) * 0.035,
              }}
            >
              <button
                type="button"
                className="group relative aspect-[4/5] w-full overflow-hidden border border-border-subtle bg-surface/20 text-left transition-colors hover:border-accent/40 focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60 sm:aspect-[5/7]"
                onClick={() => openPhoto(photo.id)}
                aria-label={`Open ${photo.title} in lightbox`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-[0.99]" aria-hidden />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 space-y-1 px-4 pb-4">
                  <span className="block text-[0.6rem] tracking-[0.28em] text-accent uppercase">
                    {categoryLabels[photo.category]}
                  </span>
                  <span className="font-display text-lg text-foreground transition-transform duration-[650ms] group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 sm:text-xl">
                    {photo.title}
                  </span>
                </span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
