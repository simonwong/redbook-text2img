import { ImageImportError } from "../image-proxy/errors";

export function imageType(bytes: Uint8Array, declared: string): string {
  if (
    !declared.toLowerCase().startsWith("image/") ||
    declared.toLowerCase().split(";")[0] === "image/svg+xml"
  ) {
    throw new ImageImportError("NOT_IMAGE");
  }
  const matches = (signature: number[]) =>
    signature.every((byte, index) => bytes[index] === byte);
  const text = (from: number, to: number) =>
    String.fromCharCode(...bytes.subarray(from, to));
  if (matches([137, 80, 78, 71, 13, 10, 26, 10])) {
    return "image/png";
  }
  if (matches([255, 216, 255])) {
    return "image/jpeg";
  }
  if (["GIF87a", "GIF89a"].includes(text(0, 6))) {
    return "image/gif";
  }
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") {
    return "image/webp";
  }
  if (text(0, 2) === "BM") {
    return "image/bmp";
  }
  if (text(4, 8) === "ftyp") {
    const size = new DataView(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength
    ).getUint32(0);
    for (
      let offset = 8;
      offset + 4 <= Math.min(size, bytes.length, 64);
      offset += 4
    ) {
      if (
        offset !== 12 &&
        ["avif", "avis"].includes(text(offset, offset + 4))
      ) {
        return "image/avif";
      }
    }
  }
  throw new ImageImportError("NOT_IMAGE");
}
