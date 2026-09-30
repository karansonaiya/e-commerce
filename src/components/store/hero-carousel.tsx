"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image: "/images/hero-sunscreen.png",
    tag: "Sun Care",
    title: "Sun Protection, Perfected",
    subtitle: "Broad-spectrum SPF 50 PA+++ sunscreen — hydrating, lightweight & non-greasy for everyday wear.",
    href: "/collections/all",
    cta: "Shop Now",
    contentSide: "left" as const,
    glow: "bg-orange-500/30",
  },
  {
    image: "/images/hero-anti-hairfall-shampoo.png",
    tag: "Hair Care",
    title: "Up to 99% Less Hair Fall",
    subtitle: "Anti-hairfall shampoo enriched with Biotin, Caffeine & Onion Extract — strengthens, nourishes, protects.",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
    contentSide: "right" as const,
    glow: "bg-amber-400/30",
  },
  {
    image: "/images/hero-vitamin-c-serum.png",
    tag: "Skin Care",
    title: "10% Vitamin C Radiance",
    subtitle: "Brightens skin tone, fades dark spots & boosts hydration with niacinamide-powered actives.",
    href: "/collections/serum",
    cta: "Shop Serum",
    contentSide: "left" as const,
    glow: "bg-rose-500/30",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const isRight = slide.contentSide === "right";

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-[var(--color-ink)]">
      <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[22vw] font-bold leading-none text-white/[0.04] sm:text-[16vw]">
        WESTORIA
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className={cn(
              "container-x relative flex h-full min-h-[85vh] flex-col items-center justify-center gap-10 py-16 md:flex-row md:gap-12",
              isRight && "md:flex-row-reverse"
            )}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={cn(
                "max-w-xl flex-1 text-center md:text-left",
                isRight && "md:text-right"
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                {slide.tag}
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <div
                className={cn(
                  "mt-6 flex items-center justify-center gap-3 md:justify-start",
                  isRight && "md:justify-end"
                )}
              >
                <span className="h-px w-10 bg-white/40" />
                <p className="max-w-md text-sm text-white/70 sm:text-base">{slide.subtitle}</p>
              </div>
              <Button asChild size="lg" className="mt-9">
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex flex-1 items-center justify-center"
            >
              <div
                className={cn(
                  "absolute size-72 rounded-full blur-3xl sm:size-96",
                  slide.glow
                )}
              />
              <div className="relative aspect-square w-64 shrink-0 sm:w-80 md:w-96">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[var(--color-brand)]" : "w-3 bg-white/25"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
