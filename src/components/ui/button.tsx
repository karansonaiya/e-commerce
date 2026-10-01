import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-[var(--color-brand)] text-[var(--color-ink)] transition-[background-color,color,transform] duration-300 ease-out before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-skew-x-12 before:bg-white/35 before:-translate-x-[250%] before:transition-transform before:duration-700 before:ease-out hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)] hover:text-white hover:shadow-lg hover:shadow-[var(--color-brand)]/30 hover:before:translate-x-[350%] active:translate-y-0",
        outline:
          "border border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] transition-[background-color,color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-ink)] hover:text-white active:translate-y-0",
        ghost: "bg-transparent transition-colors duration-300 hover:bg-[var(--color-cream-dark)]",
        link: "text-[var(--color-brand-dark)] underline-offset-4 hover:underline rounded-none",
        dark:
          "relative overflow-hidden bg-[var(--color-ink)] text-white transition-transform duration-300 ease-out before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-skew-x-12 before:bg-white/15 before:-translate-x-[250%] before:transition-transform before:duration-700 before:ease-out hover:-translate-y-0.5 hover:bg-black hover:before:translate-x-[350%] active:translate-y-0",
        destructive: "bg-red-600 text-white transition-colors duration-300 hover:bg-red-700",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
