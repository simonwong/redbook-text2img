"use client";

import type JSZip from "jszip";
import { useCallback } from "react";
import { withCanvasFilterCompatibility } from "@/lib/export/canvas-filter";

/** 导出倍率：3 倍图既清晰又不至于让 Canvas 过大 */
const exportScale = 3;

const generateCanvas = async (element: HTMLElement) => {
  const { default: html2canvas } = await import("html2canvas-pro");
  // 磨砂用的 CSS filter 在导出链路上要补兼容（见 docs/html2canvas-pitfalls.md 第 7 条）
  const canvas = await withCanvasFilterCompatibility(exportScale, () =>
    html2canvas(element, {
      allowTaint: true,
      backgroundColor: null,
      useCORS: true,
      logging: false,
      scale: exportScale,
    })
  );

  return canvas;
};

const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas toBlob failed"));
      }
    }, "image/png");
  });

const formatTimestamp = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

export function useImageExport(title: string) {
  const exportSingleImage = useCallback(
    async (element: HTMLElement, index = 0) => {
      const canvas = await generateCanvas(element);
      const blob = await canvasToBlob(canvas);
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${title}-${index + 1}.png`);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    },
    [title]
  );

  const generateImageBlob = useCallback(async (element: HTMLElement) => {
    const canvas = await generateCanvas(element);
    return canvasToBlob(canvas);
  }, []);

  const downloadZip = useCallback(
    async (zip: JSZip) => {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      triggerDownload(url, `${title}_${formatTimestamp()}.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    },
    [title]
  );

  return {
    exportSingleImage,
    generateImageBlob,
    downloadZip,
  };
}
