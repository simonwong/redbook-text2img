'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useMarkdownContentStore } from '@/store/markdownContent';

interface MarkdownEditorProps {
  placeholder?: string;
}

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
}

export const MarkdownEditor = memo(({ placeholder }: MarkdownEditorProps) => {
  const { content, setContent } = useMarkdownContentStore();
  const isDarkMode = useIsDarkMode();

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
        theme={isDarkMode ? githubDark : githubLight}
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
