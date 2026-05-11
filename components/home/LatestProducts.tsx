import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { latestProducts } from "@/lib/data/home";

export function LatestProducts() {
  return (
    <section
      className="border-t border-border-subtle py-16 sm:py-24"
      aria-labelledby="latest-products-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
          Shop
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="latest-products-heading"
            className="font-display text-3xl tracking-tight text-foreground sm:text-4xl"
          >
            Latest products
          </h2>
          <Link
            href="/shop"
            className="text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:text-accent uppercase"
          >
            Browse all
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestProducts.map((product) => (
            <li key={product.id}>
              <article className="flex h-full flex-col border border-border-subtle bg-surface/20">
                <Link
                  href="/shop"
                  className="group block overflow-hidden"
                  aria-describedby={`price-${product.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      className="object-cover transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-3 px-4 py-5">
                  <h3 className="font-display text-lg leading-snug text-foreground">
                    <Link
                      href="/shop"
                      className="transition-colors hover:text-accent"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  <p
                    id={`price-${product.id}`}
                    className="text-sm tabular-nums text-foreground-muted"
                  >
                    {formatMoney(product.priceCents, product.currency)}
                    {!product.inStock ? (
                      <span className="ml-2 text-[0.65rem] tracking-wider text-foreground-muted/80 uppercase">
                        · Sold out
                      </span>
                    ) : null}
                  </p>
                  <div className="mt-auto pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex min-h-10 items-center text-[0.65rem] tracking-[0.2em] text-accent underline-offset-4 transition hover:underline uppercase"
                    >
                      View in shop
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
