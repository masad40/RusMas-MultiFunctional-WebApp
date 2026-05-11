import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.imageUrls[0];
  return (
    <article className="flex h-full flex-col border border-border-subtle bg-surface/15">
      <Link href={`/shop/${product.slug}`} className="group block overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95"
            aria-hidden
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-foreground">
            <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-accent">
              {product.title}
            </Link>
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-foreground-muted">
            {formatMoney(product.priceCents, product.currency)}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {product.description}
        </p>
        <div className="mt-auto pt-2">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex min-h-10 items-center text-[0.65rem] tracking-[0.2em] text-accent underline-offset-4 transition hover:underline uppercase"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

