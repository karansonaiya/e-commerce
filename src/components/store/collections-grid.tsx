import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { CategoryGrid } from "@/components/store/category-grid";
import { getAllCategories } from "@/lib/data/categories";

export async function CollectionsGrid() {
  const categories = await getAllCategories();
  if (categories.length === 0) return null;

  return (
    <section className="container-x py-16 md:py-24">
      <Reveal className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-dark)]">
          Shop by category
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          <TextReveal text="Discover Westoria" />
        </h2>
      </Reveal>
      <CategoryGrid categories={categories} />
    </section>
  );
}
