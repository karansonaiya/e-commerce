import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { emitEvent } from "@/lib/socket";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "Failed" },
    });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const [, ...updatedProducts] = await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "Paid",
        status: "Processing",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    }),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  // Someone else viewing this product (or with it in their cart) sees the new
  // stock instantly instead of finding out only at their own checkout.
  for (const product of updatedProducts) {
    emitEvent("product:update", { id: product.id, stock: product.stock });
  }

  return NextResponse.json({ success: true, orderId: order.id });
}
