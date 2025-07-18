'use client';

import { memo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useMarkdownContentStore } from '@/store/markdownContent';

interface MarkdownEditorProps {
  placeholder?: string;
}

export const MarkdownEditor = memo(({ placeholder }: MarkdownEditorProps) => {
  const { content, setContent } = useMarkdownContentStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
  };

  return (
    <div className="h-full">
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder || '在这里输入您的 Markdown 内容...'}
        className="h-full resize-none border-0 
        focus:ring-0 focus:border-0 text-sm font-mono 
        leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0
        bg-accent
        "
      />
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';
