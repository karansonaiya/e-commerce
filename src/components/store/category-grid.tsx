"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

const MAX_VISIBLE = 6;

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? categories : categories.slice(0, MAX_VISIBLE);
  const hasMore = categories.length > MAX_VISIBLE;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {visible.map((c, i) => (
          <Reveal key={c.id} variant="zoom" delay={(i % MAX_VISIBLE) * 0.1}>
            <Link
              href={`/collections/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dark)] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-brand)]/30 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-light)]/40 via-[var(--color-brand)]/20 to-[var(--color-cream-dark)] transition-transform duration-700 ease-out group-hover:scale-110" />
                )}
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {c.name}
                    </span>
                  </h3>
                  {c.description && (
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.description}</p>
                  )}
                </div>
                <ArrowUpRight className="size-5 shrink-0 -translate-x-1 translate-y-1 text-[var(--color-ink-soft)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[var(--color-brand-dark)] group-hover:opacity-100" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setShowAll(true)}>
            Show All Categories
          </Button>
        </div>
      )}
    </>
  );
}
