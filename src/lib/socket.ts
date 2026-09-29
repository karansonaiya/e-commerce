import type { Server as IOServer } from "socket.io";

// Holds the single Socket.IO server instance for this Node process (set once
// by server.ts). Server actions and API routes import `emitEvent` to push
// realtime updates to connected browsers — never `setIO` directly.
const globalForIO = globalThis as unknown as { io?: IOServer };

export function setIO(io: IOServer) {
  globalForIO.io = io;
}

export function emitEvent(event: string, payload: unknown) {
  globalForIO.io?.emit(event, payload);
}
