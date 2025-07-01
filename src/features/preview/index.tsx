'use client';

import { Download, FileText, ImageDownIcon, PaletteIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CardWrap } from '@/components/card-wrap';
import { Tooltip } from '@/components/tooltip';
import { Button } from '@/components/ui/button';
import { useImageRefs } from '@/features/preview/hooks/use-image-refs';
import { ImagePreview } from '@/features/preview/image-preview';
import { parseMarkdownToImages } from '@/lib/markdown-parser';
import { useMarkdownContentStore } from '@/store/markdownContent';
import { showSettingStore } from '@/store/styleConfig';
import { useImageExport } from './hooks/use-image-export';
import './index.css';

export const PreviewCard = () => {
  const [isExporting, setIsExporting] = useState(false);
  const switchShowSetting = showSettingStore(
    (state) => state.switchShowSetting
  );

  // 从 zustand store 获取 markdown 内容和重置方法
  const { content: markdown } = useMarkdownContentStore();

  // 解析 Markdown 为图片段落
  const segments = useMemo(() => parseMarkdownToImages(markdown), [markdown]);

  const title = useMemo(() => {
    return segments.find((segment) => segment.isFirstImage)?.title ?? '';
  }, [segments]);

  const { exportSingleImage, exportAllImages } = useImageExport(title);

  const { imageRefs, setImageRef } = useImageRefs();

  // 导出单张图片
  const handleExportSingle = async (index: number) => {
    const element = imageRefs.current[index];
    if (!element) {
      return;
    }

    setIsExporting(true);
    await exportSingleImage(element, index);
    setIsExporting(false);
  };
  // 导出所有图片
  const handleExportAll = async () => {
    const elements = imageRefs.current.filter(
      (el) => el !== null
    ) as HTMLElement[];
    if (elements.length === 0) {
      return;
    }

    setIsExporting(true);
    await exportAllImages(elements);
    setIsExporting(false);
  };

  return (
    <CardWrap
      extra={[
        <Tooltip content="设置样式" key="setting">
          <Button onClick={switchShowSetting} variant="outline">
            <PaletteIcon />
          </Button>
        </Tooltip>,
        <Tooltip content={`导出全部 (${segments.length} 张)`} key="export">
          <Button
            className="gap-2"
            disabled={segments.length === 0 || isExporting}
            onClick={handleExportAll}
            variant="outline"
          >
            <ImageDownIcon className="h-4 w-4" />
          </Button>
        </Tooltip>,
      ]}
      title="图片预览"
    >
      <div className="h-full overflow-auto">
        {segments.length === 0 ? (
          <div className="flex h-full w-[300px] items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p>请在左侧输入 Markdown 内容</p>
              <p className="mt-1 text-gray-400 text-sm">
                使用 ## 二级标题来分割不同的图片
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {segments.map((segment, index) => (
              <div className="group relative" key={segment.id}>
                <div className="absolute top-2 left-0 z-10 flex w-full items-center justify-between gap-4 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span />
                  <Button
                    className="gap-1"
                    disabled={isExporting}
                    onClick={() => handleExportSingle(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-3 w-3" />
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
