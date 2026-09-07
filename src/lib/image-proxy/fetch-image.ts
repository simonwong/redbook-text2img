/** biome-ignore-all lint/performance/noAwaitInLoops: Redirects and stream reads must remain sequential and bounded. */
import { lookup } from "node:dns/promises";
import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";
import { ImageImportError, maxImageBytes } from "./errors";
import { validateImageTarget } from "./policy";

const ipBrackets = /^\[|\]$/g;

function aborted<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const stop = () => reject(signal.reason);
    if (signal.aborted) {
      stop();
    } else {
      signal.addEventListener("abort", stop, { once: true });
    }
    promise
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", stop));
  });
}

function imageType(bytes: Buffer, declared: string): string {
  if (!declared.toLowerCase().startsWith("image/")) {
    throw new ImageImportError("NOT_IMAGE");
  }
  if (bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return "image/png";
  }
  if (bytes.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"))) {
    return "image/jpeg";
  }
  const start = bytes.toString("ascii", 0, 6);
  if (start === "GIF87a" || start === "GIF89a") {
    return "image/gif";
  }
  if (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (bytes.toString("ascii", 0, 2) === "BM") {
    return "image/bmp";
  }
  if (bytes.toString("ascii", 4, 8) === "ftyp") {
    const end = Math.min(bytes.readUInt32BE(0), bytes.length, 64);
    for (let offset = 8; offset + 4 <= end; offset += 4) {
      if (
        offset !== 12 &&
        ["avif", "avis"].includes(bytes.toString("ascii", offset, offset + 4))
      ) {
        return "image/avif";
      }
    }
  }
  throw new ImageImportError("NOT_IMAGE");
}

async function openImageResponse(
  source: string,
  ownHost: string,
  signal: AbortSignal
): Promise<IncomingMessage> {
  let current = source;
  for (let redirects = 0; ; redirects += 1) {
    const url = validateImageTarget(current, ownHost, undefined, redirects);
    const host = url.hostname.replace(ipBrackets, "");
    const family = isIP(host);
    const addresses = family
      ? [{ address: host, family }]
      : await aborted(lookup(host, { all: true }), signal);
    validateImageTarget(
      current,
      ownHost,
      addresses.map((entry) => entry.address),
      redirects
    );
    const [address] = addresses;
    const upstream = await aborted(
      new Promise<IncomingMessage>((resolve, reject) => {
        const request = (
          url.protocol === "https:" ? httpsRequest : httpRequest
        )(
          url,
          {
            agent: false,
            headers: { accept: "image/*", "accept-encoding": "identity" },
            lookup: (_hostname, options, callback) => {
              if (options.all) {
                callback(null, [address]);
              } else {
                callback(null, address.address, address.family);
              }
            },
            signal,
          },
          resolve
        );
        request.on("error", reject);
        request.end();
      }),
      signal
    );
    const status = upstream.statusCode ?? 502;
    if ([301, 302, 303, 307, 308].includes(status)) {
      const { location } = upstream.headers;
      upstream.destroy();
      if (!location) {
        throw new ImageImportError("FETCH_DENIED");
      }
      try {
        current = new URL(location, url).href;
      } catch (cause) {
        throw new ImageImportError("INVALID_ADDRESS", { cause });
      }
      continue;
    }
    if (status < 200 || status >= 300) {
      upstream.destroy();
      throw new ImageImportError("FETCH_DENIED");
    }
    return upstream;
  }
}

export async function fetchImage(
  source: string,
  ownHost: string,
  clientSignal: AbortSignal
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new ImageImportError("TIMEOUT")),
    10_000
  );
  const signal = AbortSignal.any([clientSignal, controller.signal]);
  let upstream: IncomingMessage | undefined;
  try {
    upstream = await openImageResponse(source, ownHost, signal);
    if (!upstream.headers["content-type"]?.toLowerCase().startsWith("image/")) {
      throw new ImageImportError("NOT_IMAGE");
    }
    if (Number(upstream.headers["content-length"]) > maxImageBytes) {
      throw new ImageImportError("TOO_LARGE");
    }
    const iterator = upstream[Symbol.asyncIterator]();
    let prefix = Buffer.alloc(0);
    let ended = false;
    while (prefix.length < 64) {
      const next = await aborted(iterator.next(), signal);
      if (next.done) {
        ended = true;
        break;
      }
      prefix = Buffer.concat([prefix, Buffer.from(next.value)]);
      if (prefix.length > maxImageBytes) {
        throw new ImageImportError("TOO_LARGE");
      }
    }
    const contentType = imageType(
      prefix,
      upstream.headers["content-type"] ?? ""
    );
    const body = (async function* () {
      let total = prefix.length;
      try {
        if (signal.aborted) {
          throw signal.reason;
        }
        yield prefix;
        while (!ended) {
          const next = await aborted(iterator.next(), signal);
          if (next.done) {
            break;
          }
          const chunk = Buffer.from(next.value);
          total += chunk.length;
          if (total > maxImageBytes) {
            throw new ImageImportError("TOO_LARGE");
          }
          yield chunk;
        }
      } catch (error) {
        throw signal.aborted ? signal.reason : error;
      } finally {
        clearTimeout(timeout);
        upstream?.destroy();
      }
    })();
    return { body, contentType };
  } catch (error) {
    clearTimeout(timeout);
    upstream?.destroy();
    throw signal.aborted ? signal.reason : error;
  }
}
