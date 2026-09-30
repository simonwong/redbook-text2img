/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, type ViewUpdate } from "@codemirror/view";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useMarkdownContentStore } from "@/store/markdown-content";
import { contentImageEvents } from "./image-input";
import { ImageNoticeBanner } from "./image-notice-banner";
import { showImageNotice } from "./image-notices";

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

// 编辑区直接落在面板材质上：主题自带的底色会在工具栏下方切出一条色差
const editorSurface = {
  background: "transparent",
  caret: "var(--ds-ink)",
  foreground: "var(--ds-ink)",
  gutterBackground: "transparent",
};
const lightTheme = githubLightInit({ settings: editorSurface });
const darkTheme = githubDarkInit({ settings: editorSurface });

interface MarkdownEditorProps {
  onEditorViewReady?: (view: EditorView) => void;
  onUpdate?: (update: ViewUpdate) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  placeholder,
  onEditorViewReady,
  onUpdate,
}: MarkdownEditorProps) {
  const updateCallback = useRef(onUpdate);
  useLayoutEffect(() => {
    updateCallback.current = onUpdate;
  }, [onUpdate]);
  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.lineWrapping,
      editorLayoutTheme,
      contentImageEvents(showImageNotice),
      EditorView.updateListener.of((update) =>
        updateCallback.current?.(update)
      ),
    ],
    []
  );
  const { content, setContent } = useMarkdownContentStore();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="h-full overflow-hidden">
      <ImageNoticeBanner />
      <CodeMirror
        basicSetup={{
          foldGutter: false,
          highlightActiveLine: false,
          lineNumbers: false,
        }}
        className={editorClassName}
        extensions={extensions}
        onChange={setContent}
        onCreateEditor={(view) => onEditorViewReady?.(view)}
        placeholder={placeholder || "在这里输入您的 Markdown 内容..."}
        theme={isDarkMode ? darkTheme : lightTheme}
        value={content}
      />
    </div>
  );
}
