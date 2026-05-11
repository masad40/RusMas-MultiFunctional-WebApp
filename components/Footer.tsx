import Link from "next/link";

const socials = [
  { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "" },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "" },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "" },
].filter((s) => s.href);

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle py-10 text-center">
      <p className="text-[0.65rem] tracking-[0.25em] text-foreground-muted uppercase">
        Portfolio &amp; commerce
      </p>
      <div className="mx-auto mt-4 h-px w-16 bg-accent/40" aria-hidden />

      {socials.length > 0 && (
        <nav className="mt-6 flex justify-center gap-6" aria-label="Social media">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] tracking-[0.2em] uppercase text-foreground-muted transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}

      <p className="mt-6 text-[0.6rem] tracking-widest text-foreground-muted/50 uppercase">
        <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
      </p>
    </footer>
  );
}
