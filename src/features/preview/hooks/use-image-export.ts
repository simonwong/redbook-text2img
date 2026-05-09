"use client";

import html2canvas from "html2canvas-pro";
import JSZip from "jszip";
import { useCallback } from "react";

const generateCanvas = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, {
    allowTaint: true,
    backgroundColor: null,
    useCORS: true,
    logging: true,
    scale: 3,
  });

  return canvas;
};

const downloadImageByCanvas = (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
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

export function useImageExport(title: string) {
  const exportSingleImage = useCallback(
    async (element: HTMLElement, index = 0) => {
      const canvas = await generateCanvas(element);
      downloadImageByCanvas(canvas, `${title}-${index + 1}.png`);
    },
    [title]
  );

  const generateImageBlob = useCallback(async (element: HTMLElement) => {
    const canvas = await generateCanvas(element);
    return canvasToBlob(canvas);
  }, []);

  const downloadZip = useCallback(
    async (blobs: Blob[]) => {
      const zip = new JSZip();
      for (let i = 0; i < blobs.length; i++) {
        zip.file(`${title}-${i + 1}.png`, blobs[i]);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = `${title}.zip`;
      link.href = URL.createObjectURL(zipBlob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    },
    [title]
  );

  return {
    exportSingleImage,
    generateImageBlob,
    downloadZip,
  };
}
