import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/ui/reveal";
import { getProductsByCategorySlug } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { CATEGORY_SLUGS } from "@/lib/constants";

const TITLES: Record<string, string> = {
  all: "All Products",
  "face-wash": "Face Wash",
  serum: "Serum",
  shampoo: "Shampoo",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = TITLES[slug] ?? "Collection";
  return {
    title,
    description: `Shop premium ${title.toLowerCase()} from Westoria.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug !== "all" && !CATEGORY_SLUGS.includes(slug as (typeof CATEGORY_SLUGS)[number])) {
    notFound();
  }

  const [products, category] = await Promise.all([
    getProductsByCategorySlug(slug),
    slug !== "all" ? getCategoryBySlug(slug) : Promise.resolve(null),
  ]);

  const title = TITLES[slug] ?? "Collection";

  return (
    <div className="container-x py-12">
      <Reveal className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">Collection</p>
        <h1 className="font-display mt-2 text-4xl font-semibold">{title}</h1>
        {category?.description && (
          <p className="mx-auto mt-3 max-w-2xl text-[var(--color-ink-soft)]">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]/70">{products.length} products</p>
      </Reveal>

      {products.length === 0 ? (
        <p className="py-20 text-center text-[var(--color-ink-soft)]">No products found in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} variant="zoom" delay={(i % 4) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
