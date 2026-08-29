import { relativeLuminance } from "@/lib/theme/color-contrast";

export interface ProcessedBackgroundImage {
  dataUrl: string;
  tone: "dark" | "light";
}

const maxImageSide = 1600;
const fallbackImageSide = 1024;
const jpegQuality = 0.85;
const fallbackJpegQuality = 0.72;
// 背景图持久化在 localStorage（单键约 5MB 配额），压缩后仍超限则拒绝
const maxDataUrlLength = 3_000_000;
const toneSampleSize = 8;
const lightToneLuminanceThreshold = 0.179;

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取图片"));
    };
    image.src = url;
  });

const renderToJpegDataUrl = (
  image: HTMLImageElement,
  maxSide: number,
  quality: number
): string => {
  const scale = Math.min(
    1,
    maxSide / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("无法处理图片");
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
};

/** 缩样平均亮度判断明暗基调，供画布选取可读语义色 */
const sampleTone = (image: HTMLImageElement): "dark" | "light" => {
  const canvas = document.createElement("canvas");
  canvas.width = toneSampleSize;
  canvas.height = toneSampleSize;
  const context = canvas.getContext("2d");
  if (!context) {
    return "light";
  }
  context.drawImage(image, 0, 0, toneSampleSize, toneSampleSize);
  const { data } = context.getImageData(0, 0, toneSampleSize, toneSampleSize);
  const pixelCount = data.length / 4;
  let red = 0;
  let green = 0;
  let blue = 0;
  for (let index = 0; index < data.length; index += 4) {
    red += data[index];
    green += data[index + 1];
    blue += data[index + 2];
  }
  const luminance = relativeLuminance([
    red / pixelCount,
    green / pixelCount,
    blue / pixelCount,
  ]);
  return luminance > lightToneLuminanceThreshold ? "light" : "dark";
};

/** 上传图片压缩为本地 JPEG data URL 并采样明暗基调 */
export const processBackgroundImageFile = async (
  file: File
): Promise<ProcessedBackgroundImage> => {
  const image = await loadImage(file);
  const tone = sampleTone(image);
  let dataUrl = renderToJpegDataUrl(image, maxImageSide, jpegQuality);
  if (dataUrl.length > maxDataUrlLength) {
    dataUrl = renderToJpegDataUrl(
      image,
      fallbackImageSide,
      fallbackJpegQuality
    );
  }
  if (dataUrl.length > maxDataUrlLength) {
    throw new Error("图片过大");
  }
  return { dataUrl, tone };
};
