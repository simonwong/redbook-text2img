import {
  imageImportErrorCode,
  imageImportErrors,
} from "../../../lib/image-proxy/errors";
import { fetchImage } from "../../../lib/image-proxy/fetch-image";
import { createRateLimiter } from "../../../lib/image-proxy/rate-limit";

export const runtime = "nodejs";

// 来源头可以被非浏览器客户端伪造，按 IP 限流压住把代理当免费出口的连续调用
const allowRequest = createRateLimiter(30, 60_000);

function clientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  );
}

function allowedOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site !== null) {
    return site === "same-origin" || site === "none";
  }
  const source =
    request.headers.get("origin") ?? request.headers.get("referer");
  try {
    return (
      source !== null && new URL(source).origin === new URL(request.url).origin
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request): Promise<Response> {
  if (!allowedOrigin(request)) {
    return Response.json({ error: "FORBIDDEN_ORIGIN" }, { status: 403 });
  }
  if (!allowRequest(clientAddress(request))) {
    return Response.json(
      { error: "RATE_LIMITED" },
      {
        headers: { "cache-control": "no-store", "retry-after": "60" },
        status: imageImportErrors.RATE_LIMITED.status,
      }
    );
  }
  const url = new URL(request.url);
  const controller = new AbortController();
  try {
    const result = await fetchImage(
      url.searchParams.get("url") ?? "",
      request.headers.get("host") ?? url.host,
      AbortSignal.any([request.signal, controller.signal])
    );
    const iterator = result.body[Symbol.asyncIterator]();
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async cancel() {
        controller.abort();
        await iterator.return?.();
      },
      async pull(stream) {
        try {
          const next = await iterator.next();
          if (controller.signal.aborted) {
            return;
          }
          if (next.done) {
            stream.enqueue(
              encoder.encode(
                `${JSON.stringify({ done: true, type: result.contentType })}\n`
              )
            );
            stream.close();
          } else {
            stream.enqueue(
              encoder.encode(
                `${JSON.stringify({ chunk: Buffer.from(next.value).toString("base64") })}\n`
              )
            );
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          stream.enqueue(
            encoder.encode(
              `${JSON.stringify({ error: imageImportErrorCode(error) })}\n`
            )
          );
          stream.close();
        }
      },
    });
    return new Response(body, {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/x-ndjson",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (error) {
    const code = imageImportErrorCode(error);
    return Response.json(
      { error: code },
      {
        headers: { "cache-control": "no-store" },
        status: imageImportErrors[code].status,
      }
    );
  }
}
