"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const ITEMS = [
  {
    tag: "Spotlight",
    title: "Sun Protection, Perfected",
    desc: "Broad-spectrum SPF 50 PA+++ sunscreen that layers invisibly under makeup and never leaves a white cast — everyday armor for your skin.",
    image: "/images/hero-sunscreen.png",
    href: "/collections/all",
    cta: "Shop Now",
    color: "#8a4b0a",
    glow: "bg-orange-400/30",
  },
  {
    tag: "Bestseller",
    title: "Strength In Every Strand",
    desc: "Anti-hairfall shampoo with Biotin, Caffeine & Onion Extract — up to 99% less hair fall, starting from the very first wash.",
    image: "/images/hero-anti-hairfall-shampoo.png",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
    color: "#7a5c00",
    glow: "bg-yellow-400/30",
  },
  {
    tag: "New In",
    title: "Radiance, Bottled",
    desc: "10% Vitamin C serum that brightens skin tone, fades dark spots and boosts hydration — a visible glow in just a few weeks.",
    image: "/images/hero-vitamin-c-serum.png",
    href: "/collections/serum",
    cta: "Shop Serum",
    color: "#7a1f3d",
    glow: "bg-rose-400/30",
  },
];

const N = ITEMS.length;

function SpotlightItem({
  item,
  index,
  scrollYProgress,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const segStart = index / N;
  const segEnd = (index + 1) / N;
  const fade = (segEnd - segStart) * 0.2;

  // Inputs always span the full [0, 1] domain explicitly (rather than relying
  // on the `clamp` option) — this version of framer-motion's useTransform
  // extrapolates past the given range instead of holding the boundary value,
  // which caused faded-out items to rebound back to full opacity.
  const inputs =
    index === 0
      ? [0, segEnd - fade, segEnd, 1]
      : index === N - 1
        ? [0, segStart, segStart + fade, 1]
        : [0, segStart, segStart + fade, segEnd - fade, segEnd, 1];
  const outputs =
    index === 0
      ? [1, 1, 0, 0]
      : index === N - 1
        ? [0, 0, 1, 1]
        : [0, 0, 1, 1, 0, 0];

  const opacity = useTransform(scrollYProgress, inputs, outputs);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-16"
    >
      <div className="max-w-md text-center text-white md:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
          {item.tag}
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">{item.title}</h2>
        <p className="mt-4 text-white/70">{item.desc}</p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="mt-8 border-white/30 text-white hover:bg-white hover:text-[var(--color-ink)]"
        >
          <Link href={item.href}>{item.cta}</Link>
        </Button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className={`absolute size-72 rounded-full blur-3xl sm:size-96 ${item.glow}`} />
        <div className="relative aspect-square w-56 sm:w-64 md:w-72">
          <Image src={item.image} alt={item.title} fill className="object-contain drop-shadow-2xl" />
        </div>
      </div>
    </motion.div>
  );
}

export function ProductSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, ...ITEMS.map((_, i) => (i + 0.5) / N), 1],
    [ITEMS[0].color, ...ITEMS.map((item) => item.color), ITEMS[N - 1].color]
  );

  return (
    <section ref={containerRef} className="relative" style={{ height: `${N * 100}vh` }}>
      <motion.div
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ backgroundColor }}
      >
        <p className="absolute top-10 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
          Spotlight
        </p>
        {ITEMS.map((item, i) => (
          <SpotlightItem key={item.title} item={item} index={i} scrollYProgress={scrollYProgress} />
        ))}
      </motion.div>
    </section>
  );
}
