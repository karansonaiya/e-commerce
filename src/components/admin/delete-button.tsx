"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteButton({
  action,
  confirmText = "Are you sure you want to delete this?",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          try {
            await action();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not delete");
          }
        });
      }}
      className="rounded-md p-1.5 text-[var(--color-ink-soft)] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      aria-label="Delete"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
