"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { GalleryImage, PhotoCategory } from "@/types";

interface Props {
  images: GalleryImage[];
}

const categories: { key: PhotoCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Wedding" },
  { key: "portrait", label: "Portrait" },
  { key: "event", label: "Event" },
];

export function MasonryGallery({ images }: Props) {
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const filtered = useMemo(() => {
    return filter === "all" ? images : images.filter((img) => img.category === filter);
  }, [images, filter]);

  function openLightbox(index: number) {
    setLightbox({ open: true, index });
  }

  function closeLightbox() {
    setLightbox({ open: false, index: 0 });
  }

  function nextImage() {
    setLightbox((prev) => ({ ...prev, index: (prev.index + 1) % filtered.length }));
  }

  function prevImage() {
    setLightbox((prev) => ({ ...prev, index: (prev.index - 1 + filtered.length) % filtered.length }));
  }

  return (
    <>
      {/* Filter chips */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => {
          const active = cat.key === filter;
          return (
            <motion.button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2.5 text-[0.65rem] tracking-[0.25em] uppercase transition-all ${
                active
                  ? "bg-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  : "border border-border-subtle text-foreground-muted hover:border-gold/50 hover:text-gold"
              }`}
            >
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Masonry grid */}
      <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((img, idx) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative mb-4 cursor-pointer overflow-hidden break-inside-avoid"
              onClick={() => openLightbox(idx)}
            >
              <div className="relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="w-full transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="font-display text-lg text-white">{img.title}</p>
                  <p className="text-xs tracking-widest uppercase text-gold">{img.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-6 top-6 z-10 text-white hover:text-gold transition-colors"
              aria-label="Close"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-white hover:text-gold transition-colors"
              aria-label="Previous"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-white hover:text-gold transition-colors"
              aria-label="Next"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox.index].src}
                alt={filtered[lightbox.index].alt}
                width={filtered[lightbox.index].width}
                height={filtered[lightbox.index].height}
                className="max-h-[90vh] w-auto object-contain"
                priority
              />
              <div className="mt-4 text-center">
                <p className="font-display text-xl text-white">{filtered[lightbox.index].title}</p>
                <p className="mt-1 text-sm tracking-widest uppercase text-gold">{filtered[lightbox.index].category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
