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
    title: "Sun Protection, Perfected",
    subtitle: "Broad-spectrum SPF 50 PA+++ sunscreen — hydrating, lightweight & non-greasy for everyday wear.",
    href: "/collections/all",
    cta: "Shop Now",
    contentSide: "left" as const,
    tint: "from-orange-50 via-amber-50",
  },
  {
    image: "/images/hero-anti-hairfall-shampoo.png",
    title: "Up to 99% Less Hair Fall",
    subtitle: "Anti-hairfall shampoo enriched with Biotin, Caffeine & Onion Extract — strengthens, nourishes, protects.",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
    contentSide: "right" as const,
    tint: "from-yellow-50 via-amber-50",
  },
  {
    image: "/images/hero-vitamin-c-serum.png",
    title: "10% Vitamin C Radiance",
    subtitle: "Brightens skin tone, fades dark spots & boosts hydration with niacinamide-powered actives.",
    href: "/collections/serum",
    cta: "Shop Serum",
    contentSide: "left" as const,
    tint: "from-rose-50 via-pink-50",
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
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "absolute inset-0 bg-gradient-to-br to-[var(--color-cream)]",
            slide.tint
          )}
        >
          <div
            className={cn(
              "container-x flex h-full flex-col items-center justify-center gap-8 py-10 md:flex-row md:gap-12",
              isRight && "md:flex-row-reverse"
            )}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={cn(
                "max-w-lg flex-1 text-center md:text-left",
                isRight && "md:text-right"
              )}
            >
              <h1 className="font-display text-3xl font-semibold leading-tight text-[var(--color-ink)] sm:text-4xl md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-4 text-base text-[var(--color-ink-soft)] sm:text-lg">{slide.subtitle}</p>
              <Button asChild size="lg" className="mt-8">
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-square w-56 shrink-0 sm:w-72 md:w-80"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-contain drop-shadow-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)]/10 text-[var(--color-ink)] backdrop-blur hover:bg-[var(--color-ink)]/20"
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
                i === index ? "w-8 bg-[var(--color-brand)]" : "w-3 bg-[var(--color-ink)]/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)]/10 text-[var(--color-ink)] backdrop-blur hover:bg-[var(--color-ink)]/20"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
