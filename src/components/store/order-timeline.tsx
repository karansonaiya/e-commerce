import { Check, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

export function OrderTimeline({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <PackageX className="size-5 shrink-0" />
        <p className="text-sm font-medium">This order has been cancelled.</p>
      </div>
    );
  }

  const currentIndex = Math.max(STEPS.indexOf(status), 0);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  done
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-ink)]"
                    : "border-[var(--color-ink)]/20 text-[var(--color-ink-soft)]/50"
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-center text-xs font-medium",
                  done ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]/50"
                )}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  i < currentIndex ? "bg-[var(--color-brand)]" : "bg-[var(--color-ink)]/15"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
