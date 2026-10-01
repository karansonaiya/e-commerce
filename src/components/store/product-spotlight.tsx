"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";

const ITEMS = [
  {
    tag: "Spotlight",
    title: "Sun Protection, Perfected",
    desc: "Broad-spectrum SPF 50 PA+++ sunscreen that layers invisibly under makeup and never leaves a white cast — everyday armor for your skin.",
    image: "/images/hero-sunscreen.png",
    href: "/collections/all",
    cta: "Shop Now",
    color: "#8a4b0a",
  },
  {
    tag: "Bestseller",
    title: "Strength In Every Strand",
    desc: "Anti-hairfall shampoo with Biotin, Caffeine & Onion Extract — up to 99% less hair fall, starting from the very first wash.",
    image: "/images/hero-anti-hairfall-shampoo.png",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
    color: "#7a5c00",
  },
  {
    tag: "New In",
    title: "Radiance, Bottled",
    desc: "10% Vitamin C serum that brightens skin tone, fades dark spots and boosts hydration — a visible glow in just a few weeks.",
    image: "/images/hero-vitamin-c-serum.png",
    href: "/collections/serum",
    cta: "Shop Serum",
    color: "#7a1f3d",
  },
];

const N = ITEMS.length;

function SpotlightText({
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

  // Inputs always span the full [0, 1] domain explicitly rather than relying
  // on the `clamp` option, which doesn't hold the boundary value in this
  // framer-motion version and lets faded-out items rebound back to visible.
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
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center px-6 md:justify-start md:pl-16 lg:pl-24">
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

  // The image column is N slides tall and slides up as you scroll — a
  // continuous filmstrip moving behind a fixed-size window, rather than each
  // image crossfading in place. Percentage of the reel's own height (not vh)
  // so it stays in sync regardless of the slide's actual rendered height.
  const reelY = useTransform(scrollYProgress, [0, 1], ["0%", `-${((N - 1) / N) * 100}%`]);

  return (
    <>
      <div className="bg-[var(--color-cream)] pb-8 pt-16 text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          <TextReveal text="Spotlight On" />{" "}
          <TextReveal
            text="Westoria"
            delay={0.1}
            className="text-[var(--color-brand)]"
          />
        </h2>
      </div>

      <section
        ref={containerRef}
        className="relative bg-[var(--color-cream)]"
        style={{ height: `${N * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-start pt-6">
          <div className="container-x w-full">
            <motion.div
              className="relative flex h-[78vh] max-h-[680px] overflow-hidden rounded-3xl"
              style={{ backgroundColor }}
            >
              <div className="relative w-full md:w-1/2">
                {ITEMS.map((item, i) => (
                  <SpotlightText key={item.title} item={item} index={i} scrollYProgress={scrollYProgress} />
                ))}
              </div>

              <div className="relative hidden w-1/2 overflow-hidden md:block">
                <motion.div style={{ y: reelY }}>
                  {ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className="relative flex items-center justify-center p-12"
                      style={{ height: "78vh", maxHeight: 680 }}
                    >
                      <div className="relative aspect-square w-full max-w-xs">
                        <Image src={item.image} alt={item.title} fill className="object-contain drop-shadow-2xl" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
