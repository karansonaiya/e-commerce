"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ElementType } from "react";

// Classic "mask reveal": each word sits inside an overflow-hidden mask and
// slides up from behind it on scroll — the premium editorial text animation
// used across high-end DTC sites, built with plain framer-motion (no SplitText).
// Uses a single useInView on the container (not whileInView per word) so the
// stagger is driven from one observer instead of one per word.
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-[0.15em] -my-[0.15em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : { y: "100%" }}
            transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
