'use client';

import React from 'react';
import { CardWrap } from '@/components/card-wrap';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePreview } from '@/features/preview/image-preview';
import { parseMarkdownToImages } from '@/lib/markdown-parser';
import { useImageExport } from './hooks/use-image-export';
import { useMarkdownContentStore } from '@/store/markdownContent';
import { Download, FileText, ImageIcon, SettingsIcon } from 'lucide-react';
import { useImageRefs } from '@/features/preview/hooks/use-image-refs';
import { showSettingStore } from '@/store/styleConfig';

export const PreviewCard = () => {
  const [isExporting, setIsExporting] = useState(false);
  const switchShowSetting = showSettingStore((state) => state.switchShowSetting);

  // 从 zustand store 获取 markdown 内容和重置方法
  const { content: markdown } = useMarkdownContentStore();

  const { exportSingleImage, exportAllImages } = useImageExport();

  // 解析 Markdown 为图片段落
  const segments = useMemo(() => parseMarkdownToImages(markdown), [markdown]);

  const { imageRefs, setImageRef } = useImageRefs();

  // 导出单张图片
  const handleExportSingle = async (index: number) => {
    const element = imageRefs.current[index];
    if (!element) return;

    setIsExporting(true);
    const success = await exportSingleImage(element, `xiaohongshu-${index + 1}.png`);
    setIsExporting(false);

    if (success) {
      console.log(`图片 ${index + 1} 导出成功`);
    }
  };
  // 导出所有图片
  const handleExportAll = async () => {
    const elements = imageRefs.current.filter((el) => el !== null) as HTMLElement[];
    if (elements.length === 0) return;

    setIsExporting(true);
    const { successCount, failureCount } = await exportAllImages(elements);
    setIsExporting(false);

    console.log(`成功导出 ${successCount} 张图片，失败 ${failureCount} 张`);
  };

  return (
    <CardWrap
      title="图片预览"
      extra={[
        <Button key="setting" onClick={switchShowSetting} variant="outline">
          <SettingsIcon />
        </Button>,
        <Button
          key="export"
          onClick={handleExportAll}
          disabled={segments.length === 0 || isExporting}
          className="gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          {isExporting ? '导出中...' : `导出全部(${segments.length} 张)`}
        </Button>,
      ]}
    >
      <div className="h-full overflow-auto">
        {segments.length === 0 ? (
          <div className="flex items-center justify-center w-[300px] h-full text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>请在左侧输入 Markdown 内容</p>
              <p className="text-sm text-gray-400 mt-1">使用 ## 二级标题来分割不同的图片</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {segments.map((segment, index) => (
              <div key={segment.id} className="relative group">
                <div className="flex items-center justify-between px-3 absolute gap-4 z-10 top-2 left-0 w-full group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                  <h3></h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportSingle(index)}
                    disabled={isExporting}
                    className="gap-1"
                  >
                    <Download className="w-3 h-3" />
                    导出
                  </Button>
                </div>

                <div className="flex justify-center">
                  <ImagePreview ref={setImageRef(index)} segment={segment} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardWrap>
  );
};
