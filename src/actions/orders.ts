"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { emitEvent } from "@/lib/redis";

const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");

  const updated = await prisma.order.update({ where: { id }, data: { status } });

  emitEvent("order:update", { orderId: updated.id, userId: updated.userId, status: updated.status });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/account");
  revalidatePath(`/account/orders/${id}`);
}

export async function updateOrderTracking(id: string, formData: FormData) {
  await requireAdmin();

  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;
  const courierName = String(formData.get("courierName") || "").trim() || null;
  const trackingUrl = String(formData.get("trackingUrl") || "").trim() || null;

  const updated = await prisma.order.update({
    where: { id },
    data: { trackingNumber, courierName, trackingUrl },
  });

  emitEvent("order:update", {
    orderId: updated.id,
    userId: updated.userId,
    status: updated.status,
    trackingNumber: updated.trackingNumber,
    courierName: updated.courierName,
    trackingUrl: updated.trackingUrl,
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/account");
  revalidatePath(`/account/orders/${id}`);
}
