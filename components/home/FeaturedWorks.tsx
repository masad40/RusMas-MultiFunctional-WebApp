import Image from "next/image";
import Link from "next/link";
import { featuredWorks } from "@/lib/data/home";

export function FeaturedWorks() {
  return (
    <section
      className="border-t border-border-subtle bg-background/80 py-16 sm:py-24"
      aria-labelledby="featured-works-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Portfolio
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="featured-works-heading"
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            Featured works
          </h2>
          <Link
            href="/photography"
            className="text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:text-accent uppercase"
          >
            View archives
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWorks.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group block overflow-hidden border border-border-subtle bg-surface/30 transition-colors duration-300 hover:border-accent/35"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col gap-2 px-4 py-5">
                  <span className="text-[0.6rem] tracking-[0.28em] text-accent uppercase">
                    {item.tag}
                  </span>
                  <span className="font-display text-xl text-foreground">
                    {item.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
