import type { CustomThemeCrop } from "./types";

const FILE_EXTENSION_PATTERN = /\.[^.]+$/;

export const CUSTOM_THEME_MAX_COUNT = 20;
export const CUSTOM_THEME_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const CUSTOM_THEME_OUTPUT_WIDTH = 1125;
export const CUSTOM_THEME_OUTPUT_HEIGHT = 1500;
export const CUSTOM_THEME_OUTPUT_QUALITY = 0.82;
export const CUSTOM_THEME_ASPECT_RATIO =
  CUSTOM_THEME_OUTPUT_WIDTH / CUSTOM_THEME_OUTPUT_HEIGHT;
export const CUSTOM_THEME_SCALE_MIN = 1;
export const CUSTOM_THEME_SCALE_MAX = 4;
export const CUSTOM_THEME_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function getThemeNameFromFile(fileName: string): string {
  const normalized = fileName.replace(FILE_EXTENSION_PATTERN, "").trim();
  return normalized || "我的主题";
}

export function validateCustomThemeFile(file: File): void {
  if (!CUSTOM_THEME_ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("仅支持 PNG、JPG、WebP 图片");
  }

  if (file.size > CUSTOM_THEME_MAX_FILE_SIZE) {
    throw new Error("图片不能超过 10MB");
  }
}

export function clampCustomThemeScale(scale: number): number {
  return Math.min(
    CUSTOM_THEME_SCALE_MAX,
    Math.max(CUSTOM_THEME_SCALE_MIN, scale)
  );
}

function getBaseCropSize(sourceWidth: number, sourceHeight: number) {
  const sourceRatio = sourceWidth / sourceHeight;

  if (sourceRatio >= CUSTOM_THEME_ASPECT_RATIO) {
    return {
      width: sourceHeight * CUSTOM_THEME_ASPECT_RATIO,
      height: sourceHeight,
    };
  }

  return {
    width: sourceWidth,
    height: sourceWidth / CUSTOM_THEME_ASPECT_RATIO,
  };
}

export function getDefaultCustomThemeCrop(
  sourceWidth: number,
  sourceHeight: number
): CustomThemeCrop {
  return {
    x: sourceWidth / 2,
    y: sourceHeight / 2,
    scale: CUSTOM_THEME_SCALE_MIN,
    sourceWidth,
    sourceHeight,
  };
}

export function clampCustomThemeCrop(crop: CustomThemeCrop): CustomThemeCrop {
  const scale = clampCustomThemeScale(crop.scale);
  const baseCropSize = getBaseCropSize(crop.sourceWidth, crop.sourceHeight);
  const cropWidth = baseCropSize.width / scale;
  const cropHeight = baseCropSize.height / scale;

  return {
    ...crop,
    scale,
    x: Math.min(
      crop.sourceWidth - cropWidth / 2,
      Math.max(cropWidth / 2, crop.x)
    ),
    y: Math.min(
      crop.sourceHeight - cropHeight / 2,
      Math.max(cropHeight / 2, crop.y)
    ),
  };
}

export function getCustomThemeCropRect(crop: CustomThemeCrop) {
  const clampedCrop = clampCustomThemeCrop(crop);
  const baseCropSize = getBaseCropSize(
    clampedCrop.sourceWidth,
    clampedCrop.sourceHeight
  );
  const width = baseCropSize.width / clampedCrop.scale;
  const height = baseCropSize.height / clampedCrop.scale;

  return {
    left: clampedCrop.x - width / 2,
    top: clampedCrop.y - height / 2,
    width,
    height,
  };
}

export function getPreviewImageLayout(
  crop: CustomThemeCrop,
  frameWidth: number,
  frameHeight: number
) {
  const cropRect = getCustomThemeCropRect(crop);
  const previewScale = frameWidth / cropRect.width;
  const imageWidth = crop.sourceWidth * previewScale;
  const imageHeight = crop.sourceHeight * previewScale;

  return {
    width: imageWidth,
    height: imageHeight,
    left: frameWidth / 2 - crop.x * previewScale,
    top: frameHeight / 2 - crop.y * previewScale,
    previewScale,
  };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }
      reject(new Error("图片读取失败，请重试"));
    };
    reader.onerror = () => reject(new Error("图片读取失败，请重试"));
    reader.readAsDataURL(file);
  });
}

export function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败，请更换文件"));
    image.src = source;
  });
}

export async function renderCroppedThemeImage(
  imageSource: string,
  crop: CustomThemeCrop
): Promise<string> {
  const image = await loadImage(imageSource);
  const cropRect = getCustomThemeCropRect(crop);
  const canvas = document.createElement("canvas");
  canvas.width = CUSTOM_THEME_OUTPUT_WIDTH;
  canvas.height = CUSTOM_THEME_OUTPUT_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("当前环境不支持图片裁剪，请稍后重试");
  }

  context.drawImage(
    image,
    cropRect.left,
    cropRect.top,
    cropRect.width,
    cropRect.height,
    0,
    0,
    CUSTOM_THEME_OUTPUT_WIDTH,
    CUSTOM_THEME_OUTPUT_HEIGHT
  );

  return canvas.toDataURL("image/webp", CUSTOM_THEME_OUTPUT_QUALITY);
}
