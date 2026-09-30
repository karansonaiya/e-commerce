"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-[var(--color-cream-dark)]">
        <Image src={images[active]} alt={name} fill priority className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex max-h-[560px] w-16 shrink-0 flex-col gap-3 overflow-y-auto sm:w-20 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square shrink-0 overflow-hidden rounded-lg border-2",
                active === i ? "border-[var(--color-brand)]" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
