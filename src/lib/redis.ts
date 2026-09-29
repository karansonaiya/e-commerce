import Redis from "ioredis";

// Shared pub/sub channel name for realtime updates — imported by both the
// publisher (server actions/API routes) and the SSE route handler that
// subscribes and forwards messages to connected browsers.
export const REALTIME_CHANNEL = "westoria-updates";

let publisher: Redis | undefined;

function getPublisher() {
  if (!publisher) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("Realtime is not configured. Set REDIS_URL (Upstash Redis).");
    }
    publisher = new Redis(url, { maxRetriesPerRequest: 1 });
    publisher.on("error", (err) => console.error("Redis publisher error:", err));
  }
  return publisher;
}

/**
 * Broadcasts a realtime event to all connected browsers (product stock/price
 * changes, order status/tracking updates) via Redis pub/sub — this is what
 * lets isolated Vercel serverless instances share realtime state. Fire-and-
 * forget: a missing/unreachable Redis should never break the calling action.
 */
export function emitEvent(event: string, payload: unknown) {
  try {
    getPublisher()
      .publish(REALTIME_CHANNEL, JSON.stringify({ event, payload }))
      .catch((err) => console.error("Redis publish failed:", err));
  } catch (err) {
    console.error("Realtime publish skipped:", err);
  }
}
