export const imageImportErrors = {
  FETCH_DENIED: {
    message: "该站点不允许抓取，请先保存图片后本地上传",
    status: 502,
  },
  INVALID_ADDRESS: {
    message: "地址不合法，请使用公开的 http 或 https 图片链接",
    status: 400,
  },
  NOT_IMAGE: { message: "不是图片，请检查链接或选择本地图片", status: 415 },
  TIMEOUT: { message: "抓取超时，请稍后重试或本地上传", status: 504 },
  TOO_LARGE: { message: "图片过大，请选择不超过 4MB 的图片", status: 413 },
} as const;

export type ImageImportErrorCode = keyof typeof imageImportErrors;

export class ImageImportError extends Error {
  readonly code: ImageImportErrorCode;
  constructor(code: ImageImportErrorCode, options?: ErrorOptions) {
    super(code, options);
    this.code = code;
  }
}

export function imageImportErrorCode(error: unknown): ImageImportErrorCode {
  return error instanceof ImageImportError ? error.code : "FETCH_DENIED";
}

export function isImageImportErrorCode(
  value: unknown
): value is ImageImportErrorCode {
  return typeof value === "string" && Object.hasOwn(imageImportErrors, value);
}

export const maxImageBytes = 4 * 1024 * 1024;
