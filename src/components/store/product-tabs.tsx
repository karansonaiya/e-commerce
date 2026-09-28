import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/store/product-card";
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
        <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
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
        </div>

        <TabsContent value="bestsellers">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new-arrivals">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
