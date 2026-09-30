import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { ProductCard as ProductCardType } from "@/types";

export function ProductTabs({
  bestsellers,
  newArrivals,
}: {
  bestsellers: ProductCardType[];
  newArrivals: ProductCardType[];
}) {
  return (
    <section className="container-x py-16 md:py-24">
      <Tabs defaultValue="bestsellers">
        <Reveal className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
              Fan favorites
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Shop the Collection</h2>
          </div>
          <TabsList>
            <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
            <TabsTrigger value="new-arrivals">New Arrivals</TabsTrigger>
          </TabsList>
        </Reveal>

        <TabsContent value="bestsellers">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {bestsellers.map((p, i) => (
              <Reveal key={p.id} variant="zoom" delay={(i % 5) * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new-arrivals">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} variant="zoom" delay={(i % 5) * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
