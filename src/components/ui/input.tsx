import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-[var(--color-ink)]/15 bg-white px-4 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/50 outline-none transition-colors focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
