"use client";

import { undo } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";
import {
  ArrowReloadHorizontalIcon,
  ArrowTurnBackwardIcon,
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
import { Button } from "@/components/ui/button";
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
import { TemplatePicker } from "./template-picker";
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
    <div className="flex items-center justify-between gap-2 px-2.5 pt-2.5">
      {/* 格式工具药丸：按钮之间留 2px，分组间 12px；窄面板时横向滚动而不是把右侧挤出去 */}
      <div className="ds-raised ds-scrollbar-none flex h-[42px] min-w-0 items-center gap-0.5 overflow-x-auto rounded-full px-[6px]">
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
        <ToolbarButton
          icon={MinusPlusSquare01Icon}
          label="分割线 ---"
          onClick={() => exec(insertHorizontalRule)}
        />
      </div>

      {/* 文档操作：撤销、模板与重置，和格式工具分开成右侧一组 */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="ds-raised flex h-[42px] items-center gap-0.5 rounded-full px-[6px]">
          <ToolbarButton
            icon={ArrowTurnBackwardIcon}
            label="撤销"
            onClick={() => exec(undo)}
          />
          <TemplatePicker />
        </div>
        {isChange && (
          <Button onClick={resetContent} size="sm" variant="ghost">
            <HugeiconsIcon
              className="size-[13px]"
              icon={ArrowReloadHorizontalIcon}
            />
            重置
          </Button>
        )}
      </div>
    </div>
  );
};
