"use client";

import html2canvas from "html2canvas-pro";
import type JSZip from "jszip";
import { useCallback } from "react";

const generateCanvas = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, {
    allowTaint: true,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    scale: 3,
  });

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
