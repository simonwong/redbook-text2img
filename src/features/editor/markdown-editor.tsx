"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMarkdownContentStore } from "@/store/markdownContent";

interface MarkdownEditorProps {
  onEditorViewReady?: (view: EditorView) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  placeholder,
  onEditorViewReady,
}: MarkdownEditorProps) {
  const { content, setContent } = useMarkdownContentStore();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

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
          EditorView.lineWrapping,
        ]}
        onChange={setContent}
        onCreateEditor={(view) => onEditorViewReady?.(view)}
        placeholder={placeholder || "在这里输入您的 Markdown 内容..."}
        theme={isDarkMode ? githubDark : githubLight}
        value={content}
      />
    </div>
  );
}
