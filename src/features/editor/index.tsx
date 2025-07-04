'use client';

import { RotateCcwIcon } from 'lucide-react';
import { CardWrap } from '@/components/card-wrap';
import { Button } from '@/components/ui/button';
import { useMarkdownContentStore } from '@/store/markdownContent';
import { MarkdownEditor } from './markdown-editor';

export const EditorCard = () => {
  const { resetContent, isChange } = useMarkdownContentStore();

  return (
    <CardWrap
      className="flex-1"
      extra={
        isChange && (
          <Button onClick={resetContent} size="sm" variant="outline">
            <RotateCcwIcon className="h-4 w-4" />
            重置示例
          </Button>
        )
      }
      title="Markdown 编辑器"
    >
      <MarkdownEditor placeholder="在这里输入您的 Markdown 内容..." />
    </CardWrap>
  );
};
