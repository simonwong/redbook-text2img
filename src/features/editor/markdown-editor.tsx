"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import type { EditorView } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { memo, useCallback } from "react";
import { useMarkdownContentStore } from "@/store/markdownContent";

interface MarkdownEditorProps {
  onEditorViewReady?: (view: EditorView) => void;
  placeholder?: string;
}

export const MarkdownEditor = memo(
  ({ placeholder, onEditorViewReady }: MarkdownEditorProps) => {
    const { content, setContent } = useMarkdownContentStore();
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark";

    const handleChange = useCallback(
      (value: string) => {
        setContent(value);
      },
      [setContent]
    );

    const handleCreateEditor = useCallback(
      (view: EditorView) => {
        onEditorViewReady?.(view);
      },
      [onEditorViewReady]
    );

    return (
      <div className="h-full overflow-hidden">
        <CodeMirror
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
          }}
          className="h-full text-sm [&_.cm-content]:font-mono [&_.cm-content]:leading-relaxed [&_.cm-editor]:h-full [&_.cm-editor]:bg-transparent [&_.cm-scroller]:overflow-auto"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={handleChange}
          onCreateEditor={handleCreateEditor}
          placeholder={placeholder || "在这里输入您的 Markdown 内容..."}
          theme={isDarkMode ? githubDark : githubLight}
          value={content}
        />
      </div>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";
