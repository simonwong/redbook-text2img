'use client';

import { memo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useTheme } from 'next-themes';
import { useMarkdownContentStore } from '@/store/markdownContent';
import { useSettingsPanelStore } from '@/store/theme';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  placeholder?: string;
}

export const MarkdownEditor = memo(({ placeholder }: MarkdownEditorProps) => {
  const { content, setContent } = useMarkdownContentStore();
  const { isOpen: isSettingsOpen } = useSettingsPanelStore();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
    },
    [setContent]
  );

  return (
    <div className={cn("h-full overflow-hidden")}>
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
