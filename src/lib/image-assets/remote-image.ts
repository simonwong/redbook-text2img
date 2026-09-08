/** biome-ignore-all lint/performance/noAwaitInLoops: Read streams sequentially to enforce size bounds and backpressure. */
import {
  ImageImportError,
  isImageImportErrorCode,
  maxImageBytes,
} from "../image-proxy/errors";

import { imageType } from "./image-type";

async function directImage(url: string): Promise<Blob> {
  const response = await fetch(url, {
    credentials: "omit",
    mode: "cors",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(10_000),
  });
  const type = response.headers.get("content-type") ?? "";
  if (
    !(response.ok && type.toLowerCase().startsWith("image/") && response.body)
  ) {
    await response.body?.cancel();
    throw new ImageImportError("NOT_IMAGE");
  }
  const reader = response.body.getReader();
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) {
        break;
      }
      size += next.value.length;
      if (size > maxImageBytes) {
        throw new ImageImportError("TOO_LARGE");
      }
      parts.push(next.value);
    }
    const blob = new Blob(parts, { type });
    const detected = imageType(
      new Uint8Array(await blob.slice(0, 16).arrayBuffer()),
      type
    );
    return blob.slice(0, blob.size, detected);
  } finally {
    await reader.cancel();
  }
}

interface ProxyImageState {
  parts: Uint8Array<ArrayBuffer>[];
  size: number;
  type: string;
}
function acceptProxyMessage(
  message: { error?: unknown; chunk?: unknown; done?: unknown; type?: unknown },
  state: ProxyImageState
) {
  if (isImageImportErrorCode(message.error)) {
    throw new ImageImportError(message.error);
  }
  if (state.type) {
    throw new ImageImportError("FETCH_DENIED");
  }
  if (typeof message.chunk === "string") {
    const bytes = Uint8Array.from(atob(message.chunk), (char) =>
      char.charCodeAt(0)
    );
    state.size += bytes.length;
    if (state.size > maxImageBytes) {
      throw new ImageImportError("TOO_LARGE");
    }
    state.parts.push(bytes);
  } else if (
    message.done === true &&
    typeof message.type === "string" &&
    message.type.startsWith("image/")
  ) {
    state.type = message.type;
  } else {
    throw new ImageImportError("FETCH_DENIED");
  }
}

async function proxyImage(url: string): Promise<Blob> {
  const response = await fetch(
    `/api/image-proxy?url=${encodeURIComponent(url)}`,
    { signal: AbortSignal.timeout(15_000) }
  );
  if (!response.ok) {
    const result = await response.json();
    throw new ImageImportError(
      isImageImportErrorCode(result.error) ? result.error : "FETCH_DENIED"
    );
  }
  if (!response.body) {
    throw new ImageImportError("FETCH_DENIED");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parts: Uint8Array<ArrayBuffer>[] = [];
  let buffered = "";
  const state: ProxyImageState = { parts, size: 0, type: "" };
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) {
        break;
      }
      buffered += decoder.decode(next.value, { stream: true });
      if (buffered.length > 6 * 1024 * 1024) {
        throw new ImageImportError("TOO_LARGE");
      }
      let end = buffered.indexOf("\n");
      while (end >= 0) {
        const message = JSON.parse(buffered.slice(0, end));
        buffered = buffered.slice(end + 1);
        acceptProxyMessage(message, state);
        end = buffered.indexOf("\n");
      }
    }
    if (!state.type || buffered || state.size === 0) {
      throw new ImageImportError("FETCH_DENIED");
    }
    return new Blob(parts, { type: state.type });
  } finally {
    await reader.cancel();
  }
}

export async function fetchRemoteImage(source: string): Promise<Blob> {
  let url: URL;
  try {
    url = new URL(source);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      throw new Error("invalid");
    }
  } catch (cause) {
    throw new ImageImportError("INVALID_ADDRESS", { cause });
  }
  try {
    return await directImage(url.href);
  } catch {
    try {
      return await proxyImage(url.href);
    } catch (error) {
      throw error instanceof ImageImportError
        ? error
        : new ImageImportError("FETCH_DENIED");
    }
  }
}
