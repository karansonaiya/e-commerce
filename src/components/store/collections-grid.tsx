import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

const COLLECTIONS = [
  { name: "Face Wash", slug: "face-wash", image: "/images/hero-sunscreen.png", desc: "Foaming cleansers, from ₹399" },
  { name: "Serum", slug: "serum", image: "/images/hero-vitamin-c-serum.png", desc: "Targeted actives, from ₹499" },
  { name: "Shampoo", slug: "shampoo", image: "/images/hero-anti-hairfall-shampoo.png", desc: "Sulphate-free care, from ₹349" },
];

export function CollectionsGrid() {
  return (
    <section className="container-x py-16 md:py-24">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">Shop by category</p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            <TextReveal text="Discover Westoria" />
          </h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.slug} variant="zoom" delay={i * 0.1}>
            <Link
              href={`/collections/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dark)] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-brand)]/30 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
                />
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {c.name}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.desc}</p>
                </div>
                <ArrowUpRight className="size-5 shrink-0 -translate-x-1 translate-y-1 text-[var(--color-ink-soft)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[var(--color-brand)] group-hover:opacity-100" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
