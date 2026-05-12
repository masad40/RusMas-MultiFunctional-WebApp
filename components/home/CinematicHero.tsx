"use client";

import { motion } from "framer-motion";

export function CinematicHero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80&auto=format&fit=crop"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-cinematic-camera-movement-9735/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[0.65rem] tracking-[0.4em] text-gold uppercase"
        >
          Cinematic Excellence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-display mt-6 text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl"
        >
          Rusmas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg"
        >
          Premium photography, videography, and curated products crafted with precision and artistry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/shop"
            className="group relative overflow-hidden bg-gold px-8 py-4 text-sm font-semibold tracking-widest text-black uppercase transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            <span className="relative z-10">Explore Shop</span>
            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover:translate-x-0" />
          </a>

          <a
            href="/photography"
            className="border border-gold/30 px-8 py-4 text-sm font-semibold tracking-widest text-gold uppercase transition-all hover:border-gold hover:bg-gold/10"
          >
            View Portfolio
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] tracking-[0.3em] text-foreground-muted uppercase">Scroll</span>
          <svg
            className="h-5 w-5 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
