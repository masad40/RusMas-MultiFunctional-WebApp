import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { getProductBySlug, shopCategoryLabels } from "@/lib/data/shop";
import { AddToCartButton } from "@/components/shop/cart/AddToCartButton";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description,
  };
}

function buildWhatsAppLink(productTitle: string) {
  const phone = process.env.WHATSAPP_PHONE?.replace(/[^\d]/g, "");
  const text = `Hi! I'd like to order: ${productTitle}`;
  const url = new URL(`https://wa.me/${phone ?? ""}`);
  url.searchParams.set("text", text);
  return url.toString();
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const image = product.imageUrls[0];
  const wa = buildWhatsAppLink(product.title);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-14 sm:px-6 sm:py-20">
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link
          href="/shop"
          className="text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:text-accent uppercase"
        >
          ← Back to shop
        </Link>
        <Link
          href="/cart"
          className="border border-border-subtle px-3 py-2 text-[0.65rem] tracking-[0.2em] text-foreground-muted transition-colors hover:border-accent-soft hover:text-accent uppercase"
        >
          Cart
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="border border-border-subtle bg-surface/15">
          <div className="relative aspect-4/3">
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <section className="flex flex-col gap-5">
          <p className="text-[0.65rem] tracking-[0.3em] text-accent uppercase">
            {shopCategoryLabels[product.category]}
          </p>
          <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {product.title}
          </h1>
          <p className="text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
            {product.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-base tabular-nums text-foreground">
              {formatMoney(product.priceCents, product.currency)}
            </p>
            {!product.inStock ? (
              <span className="text-[0.65rem] tracking-[0.22em] text-foreground-muted uppercase">
                Sold out
              </span>
            ) : (
              <span className="text-[0.65rem] tracking-[0.22em] text-accent uppercase">
                In stock
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <AddToCartButton productId={product.id} disabled={!product.inStock} />
            <Link
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 border border-border-subtle bg-surface/20 px-6 py-3 text-center text-[0.68rem] tracking-[0.22em] text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground uppercase"
            >
              WhatsApp order (optional)
            </Link>
            <Link
              href="/checkout"
              className="min-h-11 border border-accent/50 px-6 py-3 text-center text-[0.68rem] tracking-[0.22em] text-foreground transition-colors hover:bg-accent hover:text-background uppercase"
            >
              Checkout
            </Link>
          </div>

          <div className="mt-6 border border-border-subtle bg-surface/15 px-4 py-4 text-xs leading-relaxed text-foreground-muted">
            Payment methods at checkout: Stripe, PayPal, or Cash on Delivery.
          </div>
        </section>
      </div>
    </main>
  );
}

