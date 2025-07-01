'use client';

import html2canvas from 'html2canvas-pro';
import { useCallback } from 'react';

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
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function useImageExport(title: string) {
  const exportSingleImage = useCallback(
    async (element: HTMLElement, index = 0) => {
      const canvas = await generateCanvas(element);

      downloadImageByCanvas(canvas, `${title}-${index + 1}.png`);
    },
    [title]
  );

  const exportAllImages = useCallback(
    async (elements: HTMLElement[]) => {
      for (const [index, element] of elements.entries()) {
        // biome-ignore lint/nursery/noAwaitInLoop: allow
        const canvas = await generateCanvas(element);
        downloadImageByCanvas(canvas, `${title}-${index + 1}.png`);
      }
    },
    [title]
  );

  return {
    exportSingleImage,
    exportAllImages,
  };
}
