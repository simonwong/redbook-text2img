'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MarkdownEditor } from './markdown-editor';
import { ImagePreview } from './image-preview';
import { StyleSelector } from './style-selector';
import { parseMarkdownToImages } from '@/lib/markdown-parser';
import { getStyleById } from '@/lib/image-styles';
import { useImageExport } from '@/hooks/use-image-export';
import { Download, FileText, ImageIcon, SettingsIcon, Sparkles } from 'lucide-react';

const defaultMarkdown = `# 欢迎使用小红书图片生成器

这是一个强大的 Markdown 转图片工具，让您轻松创建精美的社交媒体图片。

## 主要特点

**功能强大**：支持完整的 Markdown 语法，包括标题、列表、加粗、斜体等。

**样式丰富**：提供多种预设样式，满足不同的视觉需求。

## 使用方法

### 第一步：编写内容
在左侧编辑器中输入您的 Markdown 内容。

### 第二步：选择样式
从右侧面板选择您喜欢的图片样式。

### 第三步：导出图片
点击导出按钮即可下载生成的图片。

## 小贴士

- 使用 \`##\` 二级标题来分割不同的图片
- 支持 **加粗** 和 *斜体* 文字
- 三级及以下标题会自动加粗显示`;

export function MarkdownToImageApp() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [selectedStyle, setSelectedStyle] = useState('simple');
  const [isExporting, setIsExporting] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { exportSingleImage, exportAllImages } = useImageExport();
  
  // 解析 Markdown 为图片段落
  const segments = parseMarkdownToImages(markdown);
  const currentStyle = getStyleById(selectedStyle);
  
  // 设置图片引用
  const setImageRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    imageRefs.current[index] = el;
  }, []);
  
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
    const elements = imageRefs.current.filter(el => el !== null) as HTMLElement[];
    if (elements.length === 0) return;
    
    setIsExporting(true);
    const { successCount, failureCount } = await exportAllImages(elements);
    setIsExporting(false);
    
    console.log(`成功导出 ${successCount} 张图片，失败 ${failureCount} 张`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500" />
                <h1 className="text-xl font-bold text-gray-900">小红书图片生成器</h1>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Markdown 转图片
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowSetting(s => !s)} variant="outline" size="icon">
                <SettingsIcon />
              </Button>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <FileText className="w-3 h-3 mr-1" />
                {segments.length} 张图片
              </Badge>
              
              <Button 
                onClick={handleExportAll}
                disabled={segments.length === 0 || isExporting}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? '导出中...' : '导出全部'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className='flex items-center justify-between'>
                <h2 className="font-medium text-gray-900">Markdown 编辑器</h2>
                <Badge variant="outline" className="text-xs">
                  实时预览
                </Badge>
              </CardHeader>
              <CardContent>
                <MarkdownEditor
                  value={markdown}
                  onChange={setMarkdown}
                  placeholder="在这里输入您的 Markdown 内容..."
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader className='flex items-center justify-between'>
                <h2 className="font-medium text-gray-900">图片预览</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {segments.length} 张图片
                      </Badge>
                    </div>
              </CardHeader>
              <CardContent className="p-0 h-full overflow-auto">
                <div className="flex-1 p-4">
                  {segments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>请在左侧输入 Markdown 内容</p>
                        <p className="text-sm text-gray-400 mt-1">
                          使用 ## 二级标题来分割不同的图片
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {segments.map((segment, index) => (
                        <div key={segment.id} className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-700">
                              图片 {index + 1}: {segment.title}
                            </h3>
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
                            <ImagePreview
                              ref={setImageRef(index)}
                              segment={segment}
                              style={currentStyle}
                            />
                          </div>
                          
                          {index < segments.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {
            showSetting && (
              <div>
                {/* 样式选择器 */}
                <Card>
                  <CardContent className="p-4">
                    <StyleSelector
                      selectedStyle={selectedStyle}
                      onStyleChange={setSelectedStyle}
                    />
                  </CardContent>
                </Card>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
} 