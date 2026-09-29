import { prisma } from "@/lib/prisma";
import { getCashfreeClient } from "@/lib/cashfree";
import { emitEvent } from "@/lib/redis";

type FinalizeResult =
  | { success: true; alreadyPaid: boolean }
  | { success: false; status: string };

/**
 * Confirms payment for an order directly with Cashfree (never trusts the
 * client) and, if paid, marks it Paid + decrements stock exactly once.
 * Shared by the post-checkout verify route and the Cashfree webhook so both
 * paths use identical, idempotent logic.
 */
export async function finalizeOrderPayment(orderId: string): Promise<FinalizeResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return { success: false, status: "NOT_FOUND" };

  if (order.paymentStatus === "Paid") {
    return { success: true, alreadyPaid: true };
  }

  const cashfree = getCashfreeClient();
  const { data: cfOrder } = await cashfree.PGFetchOrder(order.id);

  if (cfOrder.order_status !== "PAID") {
    if (cfOrder.order_status === "EXPIRED" || cfOrder.order_status === "TERMINATED") {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "Failed" } });
    }
    return { success: false, status: cfOrder.order_status ?? "UNKNOWN" };
  }

  let cfPaymentId: string | undefined;
  try {
    const { data: payments } = await cashfree.PGOrderFetchPayments(order.id);
    cfPaymentId = payments.find((p) => p.payment_status === "SUCCESS")?.cf_payment_id;
  } catch {
    // Non-fatal — the order is confirmed PAID either way; the payment id is just for reference.
  }

  const [, ...updatedProducts] = await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "Paid",
        status: "Processing",
        cfOrderId: cfOrder.cf_order_id,
        cfPaymentId,
      },
    }),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  for (const product of updatedProducts) {
    emitEvent("product:update", { id: product.id, stock: product.stock });
  }

  return { success: true, alreadyPaid: false };
}
