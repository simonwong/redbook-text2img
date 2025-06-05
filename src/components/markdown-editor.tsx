'use client';

import { Textarea } from '@/components/ui/textarea';
import { useMarkdownContentStore } from '@/store/markdownContent';

interface MarkdownEditorProps {
  placeholder?: string;
}

export function MarkdownEditor({ placeholder }: MarkdownEditorProps) {
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
        className="h-[calc(100vh-220px)] resize-none border-0 focus:ring-0 focus:border-0 text-sm font-mono leading-relaxed"
      />
    </div>
  );
}
