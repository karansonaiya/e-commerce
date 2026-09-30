import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

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
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Discover Westoria</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.slug} variant="zoom" delay={i * 0.1}>
            <Link
              href={`/collections/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dark)] transition hover:border-[var(--color-brand)]/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-[var(--color-ink)]">{c.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.desc}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
