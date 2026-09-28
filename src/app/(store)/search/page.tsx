import { ProductCard } from "@/components/store/product-card";
import { searchProducts } from "@/lib/data/products";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-semibold">
        {q ? `Search results for "${q}"` : "Search"}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]/70">{results.length} products found</p>

      {results.length === 0 ? (
        <p className="py-16 text-center text-[var(--color-ink-soft)]">
          No products matched your search. Try a different keyword.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
