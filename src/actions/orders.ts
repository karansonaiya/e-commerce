"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");

  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/account");
}
