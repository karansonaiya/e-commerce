"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// createProduct/updateProduct redirect server-side on success, so there's no
// client state transition to react to here — the success signal travels as a
// query param, consumed once on load and then stripped from the URL.
export function ProductsPageToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");

  useEffect(() => {
    if (created === "1") {
      toast.success("Product added successfully");
      router.replace("/admin/products");
    } else if (updated === "1") {
      toast.success("Product updated successfully");
      router.replace("/admin/products");
    }
  }, [created, updated, router]);

  return null;
}
