import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCashfreeClient, getCashfreeMode } from "@/lib/cashfree";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { address: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.paymentStatus === "Paid") {
    return NextResponse.json({ error: "This order has already been paid for" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const cashfree = getCashfreeClient();
    const { data } = await cashfree.PGCreateOrder({
      order_id: order.id,
      order_amount: order.total,
      order_currency: "INR",
      customer_details: {
        customer_id: session.user.id,
        customer_phone: order.address.phone,
        customer_name: order.address.fullName,
        customer_email: session.user.email ?? undefined,
      },
      order_meta: {
        return_url: `${siteUrl}/checkout/success?orderId=${order.id}`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { cfOrderId: data.cf_order_id },
    });

    return NextResponse.json({
      paymentSessionId: data.payment_session_id,
      mode: getCashfreeMode(),
    });
  } catch (err) {
    const cfMessage =
      err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
    const message = cfMessage ?? (err instanceof Error ? err.message : "Payment gateway error");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
