"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getEmbedSrc } from "@/lib/video-embed";
import {
  getLibrary,
  getShowreel,
  videographyEntries,
} from "@/lib/data/videography";

function EmbedFrame({
  title,
  embedSrc,
  loading,
}: {
  title: string;
  embedSrc: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className="aspect-video w-full overflow-hidden border border-border-subtle bg-black/60 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.85)]">
      <iframe
        src={embedSrc}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading={loading ?? "lazy"}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function VideographyPageContent() {
  const prefersReducedMotion = useReducedMotion();
  const base = prefersReducedMotion ? 0 : 0.36;
  const stagger = prefersReducedMotion ? 0 : 0.11;

  const reel = getShowreel(videographyEntries);
  const library = getLibrary(videographyEntries);

  const reelSrc = reel ? getEmbedSrc(reel.url) : null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <motion.header
        initial={{
          opacity: prefersReducedMotion ? 1 : 0,
          y: prefersReducedMotion ? 0 : 14,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: base }}
        className="max-w-3xl"
      >
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Motion
        </p>
        <h1 className="font-display mt-4 text-3xl tracking-tight text-foreground sm:text-4xl">
          Videography
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
          Hosted showreels and deliverables streamed through privacy-focused
          YouTube or Vimeo shells—smooth entry motion without blocking first
          interactive paint.
        </p>
      </motion.header>

      {reel && (
        <motion.section
          aria-labelledby="showreel-heading"
          initial={{
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : 26,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: base, delay: prefersReducedMotion ? 0 : 0.06 }}
          className="mt-14"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
                Showreel
              </p>
              <h2
                id="showreel-heading"
                className="font-display mt-2 text-2xl tracking-tight text-foreground sm:text-3xl"
              >
                {reel.title}
              </h2>
            </div>
            <span className="text-[0.6rem] tracking-[0.28em] text-foreground-muted uppercase">
              Spotlight
            </span>
          </div>
          {reel.description ? (
            <p className="mt-4 max-w-2xl text-sm text-foreground-muted">
              {reel.description}
            </p>
          ) : null}
          <motion.div
            className="mt-8"
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              y: prefersReducedMotion ? 0 : 22,
              scale: prefersReducedMotion ? 1 : 0.97,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.52,
              delay: prefersReducedMotion ? 0 : 0.12,
              ease: [0.22, 0.94, 0.36, 1],
            }}
          >
            {reelSrc ? (
              <EmbedFrame
                title={`${reel.title} — embedded player`}
                embedSrc={reelSrc}
                loading="eager"
              />
            ) : (
              <UnsupportedNotice url={reel.url} />
            )}
          </motion.div>
        </motion.section>
      )}

      <section aria-labelledby="library-heading" className="mt-20">
        <motion.div
          initial={{
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : 14,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: base,
            delay: prefersReducedMotion ? 0 : 0.12,
          }}
        >
          <p className="text-[0.65rem] tracking-[0.28em] text-accent uppercase">
            Library
          </p>
          <h2
            id="library-heading"
            className="font-display mt-3 text-2xl tracking-tight text-foreground sm:text-3xl"
          >
            Select cuts
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-foreground-muted">
            Every row lazy-loads its iframe after the headline paints to keep TTI lean.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:gap-14">
          {library.map((entry, idx) => {
            const src = getEmbedSrc(entry.url);

            return (
              <motion.article
                key={entry.id}
                layout
                initial={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  y: prefersReducedMotion ? 0 : 34,
                  scale: prefersReducedMotion ? 1 : 0.988,
                }}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.22 } }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: base,
                  delay: prefersReducedMotion ? 0 : idx * stagger,
                  ease: [0.25, 0.74, 0.22, 1],
                }}
                className="border border-border-subtle bg-surface/15 p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl text-foreground sm:text-2xl">
                      {entry.title}
                    </h3>
                    {entry.description ? (
                      <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>
                  <ProviderTag url={entry.url} />
                </div>
                <div className="mt-6">
                  {src ? (
                    <EmbedFrame
                      title={`${entry.title} — embedded player`}
                      embedSrc={src}
                    />
                  ) : (
                    <UnsupportedNotice url={entry.url} />
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function UnsupportedNotice({ url }: { url: string }) {
  return (
    <div className="aspect-video flex w-full items-center justify-center border border-border-subtle bg-black/55 px-4 text-center">
      <p className="text-sm text-foreground-muted">
        This URL could not be converted to an embed&nbsp;payload. Inspect{" "}
        <span className="break-all font-mono text-xs text-accent/90">{url}</span>{" "}
        or paste a canonical YouTube or Vimeo watch link.
      </p>
    </div>
  );
}

function ProviderTag({ url }: { url: string }) {
  const src = getEmbedSrc(url);
  let label = "Direct";
  try {
    const host = new URL(url).hostname;
    if (host.includes("vimeo")) label = "Vimeo";
    else if (host.includes("youtube") || host.includes("youtu.be"))
      label = "YouTube";
  } catch {
    /* noop */
  }
  if (!src) label = "Unsupported";

  return (
    <span className="border border-accent/35 px-3 py-1 text-[0.6rem] tracking-[0.22em] text-accent uppercase">
      {label}
    </span>
  );
}
