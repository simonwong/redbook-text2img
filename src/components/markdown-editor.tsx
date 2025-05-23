'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="h-full">
      <Textarea
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder || '在这里输入您的 Markdown 内容...'}
        className="h-full resize-none border-0 focus:ring-0 focus:border-0 text-sm font-mono leading-relaxed"
      />
    </div>
  );
} 