"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type GalleryLightboxProps = {
  items: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const reduceMotion = useReducedMotion();
  const open = activeIndex !== null && items.length > 0;
  const item = open ? items[activeIndex!] : undefined;

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(scale);
  const draggingRef = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  scaleRef.current = scale;

  useEffect(() => {
    if (!open) return;
    scaleRef.current = 1;
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, [activeIndex, open]);

  useEffect(() => {
    if (scale <= 1 && (pan.x !== 0 || pan.y !== 0)) {
      setPan({ x: 0, y: 0 });
    }
  }, [pan.x, pan.y, scale]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetView = useCallback(() => {
    scaleRef.current = 1;
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const backdropClick = useCallback(() => {
    if (scale > 1) {
      resetView();
      return;
    }
    onClose();
  }, [onClose, resetView, scale]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setScale((s) => clamp(s + 0.25, 1, 4));
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setScale((s) => clamp(s - 0.25, 1, 4));
      }
      if (e.key === "0") {
        resetView();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNext, onPrev, resetView]);

  useEffect(() => {
    if (!open || !viewportRef.current) return;

    const el = viewportRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = clamp(
        scaleRef.current - e.deltaY * 0.0045,
        1,
        4,
      );
      scaleRef.current = next;
      setScale(next);
      if (next <= 1) {
        setPan({ x: 0, y: 0 });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, activeIndex]);

  const endPan = useCallback(() => {
    draggingRef.current = false;
    setDragging(false);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scaleRef.current <= 1) return;
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || scaleRef.current <= 1) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    endPan();
  };

  const onDoubleClick = () => {
    setScale((s) => {
      const next = s <= 1 ? 2.35 : 1;
      scaleRef.current = next;
      return next;
    });
    setPan({ x: 0, y: 0 });
  };

  const t = reduceMotion ? 0 : 0.25;

  return (
    <AnimatePresence>
      {open && item && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[100]"
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/92 backdrop-blur-sm"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: t }}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) backdropClick();
            }}
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col p-3 sm:p-6">
            <div className="pointer-events-none flex flex-1 flex-col pt-14 sm:pt-16">
              <div className="pointer-events-none relative mx-auto flex w-full max-w-6xl flex-1 flex-col">
                <div className="pointer-events-auto mb-4 flex shrink-0 items-center justify-between gap-3 px-1">
                  <p className="max-w-[60%] truncate text-[0.7rem] tracking-[0.2em] text-foreground-muted uppercase">
                    Scroll to zoom · drag to pan
                  </p>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      className="min-h-10 border border-border-subtle px-3 text-[0.65rem] tracking-[0.16em] text-foreground-muted transition-colors hover:border-accent-soft hover:text-accent uppercase"
                      onClick={() =>
                        setScale((s) => clamp(s - 0.25, 1, 4))
                      }
                      aria-label="Zoom out"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="min-h-10 border border-border-subtle px-3 text-[0.65rem] tracking-[0.16em] text-foreground-muted transition-colors hover:border-accent-soft hover:text-accent uppercase"
                      onClick={() =>
                        setScale((s) => clamp(s + 0.25, 1, 4))
                      }
                      aria-label="Zoom in"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="min-h-10 border border-border-subtle px-3 text-[0.65rem] tracking-[0.16em] text-foreground-muted transition-colors hover:border-accent-soft hover:text-accent uppercase"
                      onClick={resetView}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="ml-1 min-h-10 border border-accent/50 px-4 text-[0.65rem] tracking-[0.2em] text-foreground transition-colors hover:bg-accent hover:text-background uppercase"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div
                  ref={viewportRef}
                  className="pointer-events-auto relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-1"
                >
                  <button
                    type="button"
                    className="absolute left-0 top-1/2 z-[2] hidden min-h-11 -translate-y-1/2 border border-border-subtle bg-background/40 px-2 py-6 text-accent backdrop-blur transition hover:border-accent/60 sm:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrev();
                    }}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 z-[2] hidden min-h-11 -translate-y-1/2 border border-border-subtle bg-background/40 px-2 py-6 text-accent backdrop-blur transition hover:border-accent/60 sm:block"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
                    aria-label="Next image"
                  >
                    ›
                  </button>

                  <motion.div
                    className="relative flex h-full w-full items-center justify-center"
                    initial={{
                      opacity: reduceMotion ? 1 : 0,
                      scale: reduceMotion ? 1 : 0.97,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: reduceMotion ? 1 : 0,
                      scale: reduceMotion ? 1 : 0.97,
                    }}
                    transition={{ duration: t }}
                  >
                    <div
                      role="presentation"
                      style={{
                        transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
                        transformOrigin: "center center",
                      }}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                      onDoubleClick={onDoubleClick}
                      className={
                        scale > 1
                          ? dragging
                            ? "cursor-grabbing touch-none"
                            : "cursor-grab touch-none"
                          : "touch-manipulation"
                      }
                    >
                      <div className="relative mx-auto h-[min(74vh,860px)] w-full max-w-6xl">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-contain select-none"
                          sizes="100vw"
                          draggable={false}
                          priority
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="pointer-events-none mt-4 shrink-0 px-1 text-center"
                  initial={{ opacity: reduceMotion ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.05 }}
                >
                  <p className="font-display text-xl text-foreground sm:text-2xl">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.65rem] tracking-[0.3em] text-accent uppercase">
                    {activeIndex !== null ? `${activeIndex + 1} / ${items.length}` : ""}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
