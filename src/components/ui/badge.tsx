import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-brand)] text-white",
        outline: "border border-[var(--color-ink)]/20 text-[var(--color-ink)]",
        gold: "bg-[var(--color-gold)] text-white",
        soft: "bg-[var(--color-cream-dark)] text-[var(--color-ink)]",
        success: "bg-emerald-600 text-white",
        warning: "bg-amber-500 text-white",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
