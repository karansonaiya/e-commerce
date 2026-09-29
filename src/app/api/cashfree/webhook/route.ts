import { NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { finalizeOrderPayment } from "@/lib/finalize-order";

// Configure this URL (https://yourdomain.com/api/cashfree/webhook) in the
// Cashfree dashboard for reliable, server-to-server payment confirmation —
// independent of whether the customer's browser makes it back to return_url.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  let isValid: boolean;
  try {
    isValid = verifyCashfreeWebhookSignature({ timestamp, rawBody, signature });
  } catch {
    return NextResponse.json({ error: "Webhook verification not configured" }, { status: 500 });
  }

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const orderId: string | undefined = payload?.data?.order?.order_id;

  if (payload?.type === "PAYMENT_SUCCESS_WEBHOOK" && orderId) {
    await finalizeOrderPayment(orderId);
  }

  return NextResponse.json({ received: true });
}
