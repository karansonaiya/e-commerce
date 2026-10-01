"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Babell-style product media: every photo stacked flush in normal document
// flow (not a single active image + thumbnail picker) so scrolling naturally
// reveals each one in sequence while the info column stays sticky beside it.
// A sticky thumbnail rail sits alongside for quick jump-to-image navigation,
// and highlights whichever image is currently in view.
export function ProductImageStack({ images, name }: { images: string[]; name: string }) {
  const [zoomed, setZoomed] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = imageRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    imageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        {images.map((img, i) => (
          <div
            key={img + i}
            ref={(el) => {
              imageRefs.current[i] = el;
            }}
            className="group relative aspect-square overflow-hidden bg-[var(--color-cream-dark)] first:rounded-t-2xl last:rounded-b-2xl"
          >
            <Reveal variant="zoom" delay={i === 0 ? 0 : 0.05} className="absolute inset-0">
              <Image src={img} alt={`${name} ${i + 1}`} fill priority={i === 0} className="object-cover" />
            </Reveal>

            <Dialog open={zoomed === i} onOpenChange={(open) => setZoomed(open ? i : null)}>
              <DialogTrigger asChild>
                <button
                  aria-label="Zoom image"
                  className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 opacity-0 shadow-md transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
                >
                  <Plus className="size-5 text-[var(--color-ink)]" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-cream-dark)]">
                  <Image src={img} alt={`${name} ${i + 1}`} fill className="object-contain" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="sticky top-24 hidden h-fit max-h-[560px] w-16 shrink-0 flex-col gap-3 overflow-y-auto sm:flex sm:w-20 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => imageRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              aria-label={`Jump to photo ${i + 1}`}
              className={cn(
                "relative aspect-square shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300",
                active === i ? "border-[var(--color-brand)]" : "border-transparent hover:border-[var(--color-ink)]/20"
              )}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
