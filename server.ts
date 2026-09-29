// Custom server: wraps Next.js so we can attach a Socket.IO server on the
// same HTTP server for realtime updates (stock/price changes, order status).
// NOTE: this only runs where a persistent Node process is available (local
// dev, a VPS, Railway, Render, etc.) — it does NOT run on Vercel's
// serverless functions, which don't support long-lived custom servers.
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { setIO } from "./src/lib/socket";
import { serveUploadFile } from "./src/lib/serve-upload-file";

const dev = process.argv.includes("--dev");
const hostname = process.env.HOSTNAME || "localhost";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);

    if (parsedUrl.pathname?.startsWith("/uploads/")) {
      serveUploadFile(res, parsedUrl.pathname);
      return;
    }

    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      // no-op: nothing to clean up, events are broadcast, not per-socket state
    });
  });

  setIO(io);

  httpServer.listen(port, () => {
    console.log(`> Westoria ready on http://${hostname}:${port} (dev=${dev})`);
  });
});
