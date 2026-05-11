"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/data/home";

const AUTO_MS = 9000;
const SWIPE_PX = 48;

const primaryCtaClass =
  "relative flex min-h-11 w-full min-w-[11rem] items-center justify-center overflow-hidden border border-accent/45 bg-background/25 px-6 py-3 text-center text-[0.68rem] font-medium tracking-[0.22em] text-foreground uppercase backdrop-blur-md transition-all duration-500 ease-out will-change-transform sm:w-auto " +
  "before:pointer-events-none before:absolute before:inset-0 before:origin-left before:bg-accent before:transition-transform before:duration-500 before:ease-out before:scale-x-0 hover:before:scale-x-100 " +
  "[&_span]:relative [&_span]:z-10 hover:border-accent hover:text-background hover:-translate-y-1 hover:shadow-[0_18px_50px_-12px_rgba(212,175,55,0.35)] hover:[&_span]:text-background " +
  "active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const [pausedByHover, setPausedByHover] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const slides = heroSlides;

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }, [slides.length]);

  const select = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (reducedMotion || pausedByHover) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [go, reducedMotion, pausedByHover, index]);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartX.current;
      touchStartX.current = null;
      if (start == null || reducedMotion) return;
      const dx = e.changedTouches[0].clientX - start;
      if (dx > SWIPE_PX) go(-1);
      else if (dx < -SWIPE_PX) go(1);
    },
    [go, reducedMotion],
  );

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlighted motion"
      className="relative isolate flex min-h-[min(92dvh,56rem)] w-full overflow-hidden bg-background"
      onMouseEnter={() => setPausedByHover(true)}
      onMouseLeave={() => setPausedByHover(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 z-0">
        <video
          key={slide.id}
          aria-hidden
          className="pointer-events-none h-full w-full scale-[1.02] object-cover"
          src={slide.src}
          poster={slide.poster}
          muted
          playsInline
          loop
          preload="metadata"
          autoPlay={!reducedMotion}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/45 to-background"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.07),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8 sm:pb-28 sm:pt-20">
        <p className="text-[0.65rem] tracking-[0.38em] text-accent uppercase">
          Visual stories
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Dark frames.
          <span className="mt-2 block text-foreground-muted transition-opacity duration-500 ease-out">
            {slide.headline}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-foreground-muted sm:text-base">
          Photography, cinema, and a curated shop — one restrained stage.
        </p>

        <nav
          aria-label="Primary destinations"
          className="mt-11 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
        >
          <Link href="/photography" className={primaryCtaClass}>
            <span>Photography</span>
          </Link>
          <Link href="/videography" className={primaryCtaClass}>
            <span>Videography</span>
          </Link>
          <Link href="/shop" className={primaryCtaClass}>
            <span>Shop</span>
          </Link>
        </nav>

        <p className="sr-only" aria-live="polite">
          Slide {index + 1} of {slides.length}. {slide.headline}
        </p>
      </div>

      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8"
        role="tablist"
        aria-label="Choose slide"
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}`}
            className={
              "h-2.5 w-2.5 rounded-full border border-border-subtle transition-all duration-300 ease-out " +
              (i === index
                ? "scale-110 border-accent bg-accent shadow-[0_0_20px_rgba(212,175,55,0.45)]"
                : "bg-foreground/15 hover:border-accent/60 hover:bg-foreground/30")
            }
            onClick={() => select(i)}
          />
        ))}
      </div>
    </section>
  );
}
