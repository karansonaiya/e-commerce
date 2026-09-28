import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { ProductGallery } from "@/components/store/product-gallery";
import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { formatINR, discountPercent } from "@/lib/utils";
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
  const percent = discountPercent(product.price, product.salePrice);
  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="container-x py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--color-brand)]">
            {product.category.name}
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
            <Star className="size-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </div>

          <div className="mt-4 flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="font-display text-3xl font-semibold">{formatINR(product.salePrice)}</span>
                <span className="text-lg text-[var(--color-ink-soft)]/60 line-through">
                  {formatINR(product.price)}
                </span>
                {percent > 0 && <Badge>-{percent}%</Badge>}
              </>
            ) : (
              <span className="font-display text-3xl font-semibold">{formatINR(product.price)}</span>
            )}
          </div>

          {product.shortTagline && (
            <p className="mt-3 text-[var(--color-ink-soft)]">{product.shortTagline}</p>
          )}

          {product.scentNotes && (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]/80">
              <span className="font-medium text-[var(--color-ink)]">Key Notes: </span>
              {product.scentNotes}
            </p>
          )}

          <p className="mt-2 text-sm">
            {product.stock > 0 ? (
              <span className="text-emerald-700">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              name={product.name}
              slug={product.slug}
              image={images[0]}
              price={product.price}
              salePrice={product.salePrice}
              stock={product.stock}
            />
          </div>

          <div className="mt-8 space-y-4 border-t border-[var(--color-ink)]/10 pt-6">
            <div>
              <h2 className="font-display text-lg font-semibold">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {product.description}
              </p>
            </div>
            {product.ingredients && (
              <div>
                <h2 className="font-display text-lg font-semibold">Ingredients</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16 border-t border-[var(--color-ink)]/10 pt-10">
          <h2 className="font-display text-2xl font-semibold">Customer Reviews</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-[var(--color-ink)]/10 p-5">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-[var(--color-ink)]/10 pt-10">
          <h2 className="font-display text-2xl font-semibold">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
