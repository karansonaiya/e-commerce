"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealVariant = "up" | "fade" | "zoom";

// Zoom starts slightly scaled up so the image/content settles down into place
// (rather than growing) as it enters the viewport — reads as a gentle "zoom out".
const VARIANTS: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  zoom: { hidden: { opacity: 0, scale: 1.12 }, visible: { opacity: 1, scale: 1 } },
};

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={VARIANTS[variant]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
