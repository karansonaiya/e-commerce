import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

// Next's production static-file serving snapshots the `public/` directory at
// server startup, so files an admin uploads while the server is already
// running would 404 until a restart. This serves /uploads/* straight from
// disk on every request instead, so newly uploaded images work immediately.
const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function serveUploadFile(
  res: ServerResponse,
  pathname: string
): Promise<void> {
  const relative = decodeURIComponent(pathname.replace(/^\/uploads\//, ""));
  const filePath = path.join(UPLOADS_ROOT, relative);

  if (!filePath.startsWith(UPLOADS_ROOT + path.sep)) {
    res.statusCode = 400;
    res.end("Bad request");
    return;
  }

  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) throw new Error("not a file");

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
}
