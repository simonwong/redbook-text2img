'use client';

import { useCallback } from 'react';
import html2canvas from 'html2canvas-pro';

export function useImageExport() {
  const exportSingleImage = useCallback(
    async (element: HTMLElement, filename: string = 'image.png') => {
      try {
        const canvas = await html2canvas(element, {
          allowTaint: true,
          backgroundColor: null,
          useCORS: true,
          logging: true,
          scale: 3,
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
      } catch (error) {
        console.error('导出图片失败:', error);
        return false;
      }
    },
    []
  );

  const exportAllImages = useCallback(
    async (elements: HTMLElement[], filenamePrefix: string = 'xiaohongshu') => {
      try {
        const results = await Promise.allSettled(
          elements.map(async (element, index) => {
            const canvas = await html2canvas(element, {
              allowTaint: true,
              backgroundColor: null,
              useCORS: true,
              logging: true,
              scale: 3,
            });

            return {
              canvas,
              filename: `${filenamePrefix}-${index + 1}.png`,
            };
          })
        );

        // 下载所有成功生成的图片
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { canvas, filename } = result.value;
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });

        // 统计成功和失败的数量
        const successCount = results.filter((r) => r.status === 'fulfilled').length;
        const failureCount = results.filter((r) => r.status === 'rejected').length;

        return { successCount, failureCount };
      } catch (error) {
        console.error('批量导出图片失败:', error);
        return { successCount: 0, failureCount: elements.length };
      }
    },
    []
  );

  return {
    exportSingleImage,
    exportAllImages,
  };
}
