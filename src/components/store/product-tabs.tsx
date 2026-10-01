"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import type { ProductCard as ProductCardType } from "@/types";

export function ProductTabs({
  bestsellers,
  newArrivals,
}: {
  bestsellers: ProductCardType[];
  newArrivals: ProductCardType[];
}) {
  const [tab, setTab] = useState<"bestsellers" | "new-arrivals">("bestsellers");
  const bestsellersRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const ref = tab === "bestsellers" ? bestsellersRef : newArrivalsRef;
    ref.current?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <section className="container-x py-16 md:py-24">
      <Tabs defaultValue="bestsellers" onValueChange={(v) => setTab(v as typeof tab)}>
        <Reveal className="mb-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-dark)]">
              Fan favorites
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
              <TextReveal text="Shop the Collection" />
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <TabsList>
              <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
              <TabsTrigger value="new-arrivals">New Arrivals</TabsTrigger>
            </TabsList>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex size-9 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink-soft)] transition-all duration-300 hover:scale-110 hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand-dark)] active:scale-95"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex size-9 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink-soft)] transition-all duration-300 hover:scale-110 hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand-dark)] active:scale-95"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <TabsContent value="bestsellers">
          <div
            ref={bestsellersRef}
            className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {bestsellers.map((p, i) => (
              <Reveal
                key={p.id}
                variant="zoom"
                delay={(i % 5) * 0.08}
                className="w-[68%] shrink-0 sm:w-[42%] md:w-[30%] lg:w-[22%]"
              >
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new-arrivals">
          <div
            ref={newArrivalsRef}
            className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {newArrivals.map((p, i) => (
              <Reveal
                key={p.id}
                variant="zoom"
                delay={(i % 5) * 0.08}
                className="w-[68%] shrink-0 sm:w-[42%] md:w-[30%] lg:w-[22%]"
              >
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
