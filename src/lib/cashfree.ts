import { Cashfree, CFEnvironment } from "cashfree-pg";
import crypto from "crypto";

export function getCashfreeClient() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Cashfree keys are not configured. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET."
    );
  }

  const environment =
    process.env.CASHFREE_ENV === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

  return new Cashfree(environment, clientId, clientSecret);
}

export function getCashfreeMode(): "sandbox" | "production" {
  return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

export function verifyCashfreeWebhookSignature({
  timestamp,
  rawBody,
  signature,
}: {
  timestamp: string;
  rawBody: string;
  signature: string;
}) {
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!secret) throw new Error("CASHFREE_CLIENT_SECRET is not configured.");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");

  return expected === signature;
}
