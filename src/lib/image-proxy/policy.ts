import { isIP } from "node:net";
import { ImageImportError } from "./errors";

const ipBrackets = /^\[|\]$/g;
const trailingDots = /\.+$/;

function hostname(value: string): string {
  return new URL(`http://${value}`).hostname
    .replace(ipBrackets, "")
    .toLowerCase()
    .replace(trailingDots, "");
}

function publicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (family === 6) {
    const normalized = new URL(`http://[${address}]/`).hostname.slice(1, -1);
    const first = Number.parseInt(normalized.split(":")[0] || "0", 16);
    return (
      first >= 0x20_00 &&
      first <= 0x3f_ff &&
      !normalized.startsWith("2001:db8:") &&
      !normalized.startsWith("2001:0:") &&
      !normalized.startsWith("2001::") &&
      !normalized.startsWith("2002:")
    );
  }
  return false;
}

export function validateImageTarget(
  source: string,
  ownHost: string,
  addresses?: string[],
  redirects = 0
): URL {
  if (redirects > 3) {
    throw new ImageImportError("FETCH_DENIED");
  }
  try {
    const url = new URL(source);
    const host = hostname(url.host);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host === hostname(ownHost) ||
      (isIP(host) && !publicAddress(host)) ||
      (addresses &&
        (addresses.length === 0 ||
          addresses.some((address) => !publicAddress(address))))
    ) {
      throw new Error("blocked");
    }
    return url;
  } catch (cause) {
    throw new ImageImportError("INVALID_ADDRESS", { cause });
  }
}
