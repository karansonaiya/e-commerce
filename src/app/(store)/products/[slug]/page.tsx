import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { ProductImageStack } from "@/components/store/product-image-stack";
import { ProductLiveSection } from "@/components/store/product-live-section";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortTagline ?? product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      images: product.images.split(",").map((i) => i.trim()),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.images.split(",").map((i) => i.trim());
  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="container-x py-10">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <ProductImageStack images={images} name={product.name} />

        <div className="lg:sticky lg:top-24">
          <Reveal>
            <p className="text-sm uppercase tracking-wide text-[var(--color-brand-dark)]">
              {product.category.name}
            </p>
            <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">
              <TextReveal text={product.name} />
            </h1>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
              <Star className="size-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </div>
          </Reveal>

          <ProductLiveSection
            productId={product.id}
            name={product.name}
            slug={product.slug}
            image={images[0]}
            initialPrice={product.price}
            initialSalePrice={product.salePrice}
            initialStock={product.stock}
          />

          {product.shortTagline && (
            <p className="mt-3 text-[var(--color-ink-soft)]">{product.shortTagline}</p>
          )}

          {product.scentNotes && (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]/80">
              <span className="font-medium text-[var(--color-ink)]">Key Notes: </span>
              {product.scentNotes}
            </p>
          )}

          <div className="mt-8 space-y-4 border-t border-[var(--color-ink)]/10 pt-6">
            <Reveal>
              <h2 className="font-display text-lg font-semibold">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {product.description}
              </p>
            </Reveal>
            {product.ingredients && (
              <Reveal delay={0.1}>
                <h2 className="font-display text-lg font-semibold">Ingredients</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {product.ingredients}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16 border-t border-[var(--color-ink)]/10 pt-10">
          <h2 className="font-display text-2xl font-semibold">
            <TextReveal text="Customer Reviews" />
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {product.reviews.map((r, idx) => (
              <Reveal
                key={r.id}
                delay={idx * 0.08}
                className="rounded-xl border border-[var(--color-ink)]/10 p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < r.rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-ink)]/15"
                      }`}
                    />
                  ))}
                </div>
                {r.comment && <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{r.comment}</p>}
                <p className="mt-2 text-sm font-medium">{r.user.name ?? "Verified Buyer"}</p>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-[var(--color-ink)]/10 pt-10">
          <h2 className="font-display text-2xl font-semibold">
            <TextReveal text="You May Also Like" />
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} variant="zoom" delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
