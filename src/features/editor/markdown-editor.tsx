'use client';

import { memo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubLight } from '@uiw/codemirror-theme-github';
import { useMarkdownContentStore } from '@/store/markdownContent';

interface MarkdownEditorProps {
  placeholder?: string;
}

export const MarkdownEditor = memo(({ placeholder }: MarkdownEditorProps) => {
  const { content, setContent } = useMarkdownContentStore();

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
    },
    [setContent]
  );

  return (
    <div className="h-full overflow-hidden">
      <CodeMirror
        value={content}
        onChange={handleChange}
        placeholder={placeholder || '在这里输入您的 Markdown 内容...'}
        theme={githubLight}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
        }}
        className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-editor]:bg-accent [&_.cm-scroller]:overflow-auto [&_.cm-content]:font-mono [&_.cm-content]:leading-relaxed"
      />
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';
