import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-md border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/50 outline-none transition-colors focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
