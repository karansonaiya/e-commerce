import Redis from "ioredis";
import { REALTIME_CHANNEL } from "@/lib/redis";

// Must run on the Node.js runtime — ioredis needs a raw TCP socket, which
// isn't available on the Edge runtime.
export const runtime = "nodejs";
// Never statically optimize this route — it's a live stream.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.REDIS_URL;
  const encoder = new TextEncoder();

  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let closed = false;

  // No REDIS_URL yet: stay a normal, healthy SSE stream that just never emits
  // real events, instead of erroring — so EventSource doesn't enter an
  // error/retry loop in the browser console while realtime isn't configured.
  if (!url) {
    const stream = new ReadableStream({
      start(controller) {
        const send = (chunk: string) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(chunk));
          } catch {}
        };
        send(": realtime not configured (set REDIS_URL)\n\n");
        heartbeat = setInterval(() => send(": ping\n\n"), 20000);
      },
      cancel() {
        closed = true;
        if (heartbeat) clearInterval(heartbeat);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const subscriber = new Redis(url, { maxRetriesPerRequest: 1 });

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // controller already closed (client disconnected mid-write) — ignore
        }
      };

      subscriber.on("message", (_channel, message) => {
        send(`data: ${message}\n\n`);
      });
      subscriber.on("error", (err) => console.error("Realtime subscriber error:", err));

      subscriber.subscribe(REALTIME_CHANNEL).catch((err) => {
        console.error("Realtime subscribe failed:", err);
      });

      // Comment-only "ping" every 20s: keeps proxies/browsers from treating
      // the connection as idle, and lets the client know it's still alive.
      heartbeat = setInterval(() => send(": ping\n\n"), 20000);

      // Tell the browser to retry quickly if this connection ever drops
      // (e.g. Vercel's function duration limit) — EventSource reconnects
      // automatically using this value.
      send("retry: 2000\n\n");
    },
    cancel() {
      closed = true;
      if (heartbeat) clearInterval(heartbeat);
      subscriber.disconnect();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
