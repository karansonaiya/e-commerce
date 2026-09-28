"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    image: "/images/hero-1.svg",
    title: "Radiance Starts Here",
    subtitle: "Premium face wash for glowing, healthy skin",
    href: "/collections/face-wash",
    cta: "Shop Face Wash",
  },
  {
    image: "/images/hero-2.svg",
    title: "Serums That Work",
    subtitle: "Clinically-inspired formulas for visible results",
    href: "/collections/serum",
    cta: "Shop Serum",
  },
  {
    image: "/images/hero-3.svg",
    title: "Hair, Reimagined",
    subtitle: "Shampoos crafted for strength & shine",
    href: "/collections/shampoo",
    cta: "Shop Shampoo",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container-x relative flex h-full flex-col items-start justify-center">
        <motion.div
          key={`text-${index}`}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-xl text-white"
        >
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 text-base text-white/90 sm:text-lg">{slide.subtitle}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href={slide.href}>{slide.cta}</Link>
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
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
                i === index ? "w-8 bg-white" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
