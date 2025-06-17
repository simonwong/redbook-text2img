'use client';

import { CardWrap } from '@/components/card-wrap';
import React from 'react';
import { MarkdownEditor } from './markdown-editor';
import { Button } from '@/components/ui/button';
import { RotateCcwIcon } from 'lucide-react';
import { useMarkdownContentStore } from '@/store/markdownContent';

export const EditorCard = () => {
  const { resetContent, isChange } = useMarkdownContentStore();

  return (
    <CardWrap
      className="flex-1"
      title="Markdown 编辑器"
      extra={
        isChange && (
          <Button onClick={resetContent} variant="outline" size="sm">
            <RotateCcwIcon className="w-4 h-4" />
            重置示例
          </Button>
        )
      }
    >
      <MarkdownEditor placeholder="在这里输入您的 Markdown 内容..." />
    </CardWrap>
  );
};
