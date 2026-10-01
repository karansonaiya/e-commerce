import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { getProductsByCategorySlug } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug === "all" ? "All Products" : (await getCategoryBySlug(slug))?.name ?? "Collection";
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

  const category = slug !== "all" ? await getCategoryBySlug(slug) : null;
  if (slug !== "all" && !category) {
    notFound();
  }

  const products = await getProductsByCategorySlug(slug);

  const title = slug === "all" ? "All Products" : category?.name ?? "Collection";

  return (
    <div className="container-x py-12">
      <Reveal className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-dark)]">Collection</p>
        <h1 className="font-display mt-2 text-4xl font-semibold">
          <TextReveal text={title} />
        </h1>
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
