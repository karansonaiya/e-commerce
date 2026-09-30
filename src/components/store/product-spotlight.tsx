import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const SPOTLIGHTS = [
  {
    tag: "Spotlight",
    title: "Sun Protection, Perfected",
    desc: "Broad-spectrum SPF 50 PA+++ sunscreen that layers invisibly under makeup and never leaves a white cast — everyday armor for your skin.",
    image: "/images/hero-sunscreen.png",
    href: "/collections/all",
    cta: "Shop Now",
    bg: "bg-gradient-to-br from-orange-400 via-amber-400 to-amber-500",
  },
  {
    tag: "Bestseller",
    title: "Strength In Every Strand",
    desc: "Anti-hairfall shampoo with Biotin, Caffeine & Onion Extract — up to 99% less hair fall, starting from the very first wash.",
    image: "/images/hero-anti-hairfall-shampoo.png",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
    bg: "bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500",
  },
  {
    tag: "New In",
    title: "Radiance, Bottled",
    desc: "10% Vitamin C serum that brightens skin tone, fades dark spots and boosts hydration — a visible glow in just a few weeks.",
    image: "/images/hero-vitamin-c-serum.png",
    href: "/collections/serum",
    cta: "Shop Serum",
    bg: "bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500",
  },
];

export function ProductSpotlight() {
  return (
    <section className="overflow-hidden">
      {SPOTLIGHTS.map((item, i) => {
        const isReversed = i % 2 === 1;
        return (
          <div
            key={item.title}
            className={cn(
              "flex flex-col md:min-h-[440px] md:flex-row",
              isReversed && "md:flex-row-reverse"
            )}
          >
            <div className="flex flex-1 flex-col justify-center bg-[var(--color-ink)] px-8 py-14 text-white sm:px-12 md:px-16">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                  {item.tag}
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">{item.title}</h2>
                <p className="mt-4 max-w-md text-white/70">{item.desc}</p>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="mt-8 border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
                >
                  <Link href={item.href}>{item.cta}</Link>
                </Button>
              </Reveal>
            </div>

            <div
              className={cn(
                "relative flex flex-1 items-center justify-center overflow-hidden py-14",
                item.bg
              )}
            >
              <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-black/10 blur-3xl" />
              <Reveal variant="zoom" className="relative z-10 aspect-square w-56 sm:w-64 md:w-72">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </Reveal>
            </div>
          </div>
        );
      })}
    </section>
  );
}
