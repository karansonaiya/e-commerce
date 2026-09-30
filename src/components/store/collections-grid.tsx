import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

const COLLECTIONS = [
  { name: "Face Wash", slug: "face-wash", image: "/images/category-face-wash.svg", desc: "Foaming cleansers, from ₹399" },
  { name: "Serum", slug: "serum", image: "/images/category-serum.svg", desc: "Targeted actives, from ₹499" },
  { name: "Shampoo", slug: "shampoo", image: "/images/category-shampoo.svg", desc: "Sulphate-free care, from ₹349" },
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
            <Link href={`/collections/${c.slug}`} className="group relative block overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/5]">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-white/85">{c.desc}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
