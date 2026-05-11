import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/photography", label: "Photography" },
  { href: "/videography", label: "Videography" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle/80 backdrop-blur-md bg-background/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.2em] text-foreground uppercase"
        >
          Rusmas
        </Link>
        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.65rem] sm:text-xs tracking-[0.18em] text-foreground-muted transition-colors hover:text-accent uppercase"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-2 border border-border-subtle px-2 py-1 text-[0.65rem] sm:text-xs tracking-[0.16em] text-foreground-muted transition-colors hover:border-accent-soft hover:text-accent uppercase"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
