'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/markdown-editor';
import { ImagePreview } from '@/components/image-preview';
import { StyleConfigurator } from '@/components/style-configurator';
import { parseMarkdownToImages } from '@/lib/markdown-parser';
import { useImageExport } from '@/hooks/use-image-export';
import { useMarkdownContentStore } from '@/store/markdownContent';
import { Download, FileText, ImageIcon, SettingsIcon, RotateCcw } from 'lucide-react';
import { useImageRefs } from '@/hooks/use-image-refs';

const MarkdownToImageApp = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  // 从 zustand store 获取 markdown 内容和重置方法
  const { content: markdown, resetContent } = useMarkdownContentStore();

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
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-6 h-[calc(100vh-120px)]">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Markdown 编辑器</h2>
              <Button onClick={resetContent} variant="outline" size="sm" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                重置示例
              </Button>
            </CardHeader>
            <CardContent>
              <MarkdownEditor placeholder="在这里输入您的 Markdown 内容..." />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">图片预览</h2>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowSetting((s) => !s)} variant="outline">
                  <SettingsIcon />
                </Button>
                <Button
                  onClick={handleExportAll}
                  disabled={segments.length === 0 || isExporting}
                  className="gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  {isExporting ? '导出中...' : `导出全部(${segments.length} 张)`}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-auto">
              <div className="flex-1 p-4">
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
            </CardContent>
          </Card>
        </div>
        {showSetting && (
          <div className="w-80 overflow-auto">
            <StyleConfigurator />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownToImageApp;
