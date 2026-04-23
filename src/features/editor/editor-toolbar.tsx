"use client";

import type { EditorView } from "@codemirror/view";
import {
  ArrowReloadHorizontalIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightBlockQuoteIcon,
  ListViewIcon,
  MinusPlusSquare01Icon,
  SourceCodeIcon,
  TextBoldIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMarkdownContentStore } from "@/store/markdownContent";
import {
  insertHeading,
  insertHorizontalRule,
  toggleBlockquote,
  toggleBold,
  toggleInlineCode,
  toggleItalic,
  toggleList,
} from "./markdown-commands";
import { ToolbarButton } from "./toolbar-button";
import { ToolbarSeparator } from "./toolbar-separator";

interface EditorToolbarProps {
  editorView: EditorView | null;
}

export const EditorToolbar = ({ editorView }: EditorToolbarProps) => {
  const { resetContent, isChange } = useMarkdownContentStore();

  const exec = (fn: (view: EditorView) => void) => {
    if (editorView) {
      fn(editorView);
    }
  };

  return (
    <div className="flex h-10 items-center justify-between border-border border-b px-3">
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={TextBoldIcon}
          label="加粗"
          onClick={() => exec(toggleBold)}
        />
        <ToolbarButton
          icon={TextItalicIcon}
          label="斜体"
          onClick={() => exec(toggleItalic)}
        />
        <ToolbarSeparator />
        <ToolbarButton
          icon={Heading01Icon}
          label="一级标题"
          onClick={() => exec((v) => insertHeading(v, 1))}
        />
        <ToolbarButton
          icon={Heading02Icon}
          label="二级标题"
          onClick={() => exec((v) => insertHeading(v, 2))}
        />
        <ToolbarButton
          icon={Heading03Icon}
          label="三级标题"
          onClick={() => exec((v) => insertHeading(v, 3))}
        />
        <ToolbarSeparator />
        <ToolbarButton
          icon={ListViewIcon}
          label="无序列表"
          onClick={() => exec(toggleList)}
        />
        <ToolbarButton
          icon={LeftToRightBlockQuoteIcon}
          label="引用"
          onClick={() => exec(toggleBlockquote)}
        />
        <ToolbarButton
          icon={SourceCodeIcon}
          label="行内代码"
          onClick={() => exec(toggleInlineCode)}
        />
        <ToolbarSeparator />
        <ToolbarButton
          icon={MinusPlusSquare01Icon}
          label="分割线 ---"
          onClick={() => exec(insertHorizontalRule)}
        />
      </div>

      <div className="flex items-center gap-2">
        {isChange && (
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
            onClick={resetContent}
            type="button"
          >
            <HugeiconsIcon
              className="h-3 w-3"
              icon={ArrowReloadHorizontalIcon}
            />
            重置
          </button>
        )}
      </div>
    </div>
  );
};
