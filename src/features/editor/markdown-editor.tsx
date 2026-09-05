"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMarkdownContentStore } from "@/store/markdownContent";

const editorClassName = [
  "h-full",
  "[&_.cm-editor]:h-full [&_.cm-editor]:bg-transparent",
  "[&_.cm-gutters]:bg-transparent [&_.cm-gutters]:border-0",
  "[&_.cm-scroller]:overflow-auto [&_.cm-scroller]:font-mono",
  "[&_.cm-content]:font-mono [&_.cm-content]:text-[12.5px] [&_.cm-content]:leading-[1.85]",
].join(" ");

// 内边距通过 EditorView.theme 注入：CodeMirror 自带的 .cm-content / .cm-line
// 样式晚于 Tailwind 注入，同等优先级下会盖掉 className 里的 padding。
const editorLayoutTheme = EditorView.theme({
  ".cm-content": { padding: "14px 20px 56px" },
  ".cm-line": { padding: "0" },
});

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
          foldGutter: false,
          highlightActiveLine: false,
          lineNumbers: false,
        }}
        className={editorClassName}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          editorLayoutTheme,
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
