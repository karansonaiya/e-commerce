"use client";

// Thin pub/sub layer over a single shared EventSource (native browser API —
// no client library needed). The server publishes {event, payload} JSON
// blobs via Redis (see src/app/api/realtime/route.ts); this fans them out to
// whichever local listeners asked for that event name.
// EventSource reconnects automatically if the connection drops (including
// Vercel's function-duration limit closing it periodically) — nothing extra
// needed here for that.

type Listener = (payload: unknown) => void;

const listeners = new Map<string, Set<Listener>>();
let source: EventSource | null = null;

function ensureConnected() {
  if (source || typeof window === "undefined") return;

  source = new EventSource("/api/realtime");
  source.onmessage = (e) => {
    try {
      const { event, payload } = JSON.parse(e.data);
      listeners.get(event)?.forEach((fn) => fn(payload));
    } catch {
      // ignore malformed/heartbeat frames
    }
  };
}

/** Subscribes to one event name from the shared realtime stream. Returns an
 * unsubscribe function — call it from a useEffect cleanup. */
export function subscribeRealtime(event: string, handler: Listener) {
  ensureConnected();
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(handler);

  return () => {
    listeners.get(event)?.delete(handler);
  };
}
