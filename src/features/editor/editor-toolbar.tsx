/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
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
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Fragment, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useMarkdownContentStore } from "@/store/markdown-content";
import { AutoSplitToggle } from "./auto-split-toggle";
import { InsertImageButton } from "./insert-image-button";
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
import { ToolbarOverflowMenu } from "./toolbar-overflow-menu";
import { ToolbarSeparator } from "./toolbar-separator";
import {
  isVisibleAt,
  type ToolbarTier,
  useToolbarTier,
} from "./use-toolbar-tier";

interface EditorToolbarProps {
  editorView: EditorView | null;
}

interface FormatTool {
  group: "text" | "heading" | "block";
  icon: IconSvgElement;
  label: string;
  run: (view: EditorView) => void;
  /** 从哪一档宽度开始直接显示在工具栏上；更窄时收进「更多格式」 */
  visibleFrom: ToolbarTier;
}

const formatTools: FormatTool[] = [
  {
    group: "text",
    icon: TextBoldIcon,
    label: "加粗",
    run: toggleBold,
    visibleFrom: "narrow",
  },
  {
    group: "text",
    icon: TextItalicIcon,
    label: "斜体",
    run: toggleItalic,
    visibleFrom: "full",
  },
  {
    group: "heading",
    icon: Heading01Icon,
    label: "一级标题",
    run: (view) => insertHeading(view, 1),
    visibleFrom: "narrow",
  },
  {
    group: "heading",
    icon: Heading02Icon,
    label: "二级标题",
    run: (view) => insertHeading(view, 2),
    visibleFrom: "medium",
  },
  {
    group: "heading",
    icon: Heading03Icon,
    label: "三级标题",
    run: (view) => insertHeading(view, 3),
    visibleFrom: "full",
  },
  {
    group: "block",
    icon: ListViewIcon,
    label: "无序列表",
    run: toggleList,
    visibleFrom: "medium",
  },
  {
    group: "block",
    icon: LeftToRightBlockQuoteIcon,
    label: "引用",
    run: toggleBlockquote,
    visibleFrom: "full",
  },
  {
    group: "block",
    icon: SourceCodeIcon,
    label: "行内代码",
    run: toggleInlineCode,
    visibleFrom: "full",
  },
  {
    group: "block",
    icon: MinusPlusSquare01Icon,
    label: "分割线 ---",
    run: insertHorizontalRule,
    visibleFrom: "narrow",
  },
];

export const EditorToolbar = ({ editorView }: EditorToolbarProps) => {
  const resetContent = useMarkdownContentStore((s) => s.resetContent);
  const isChange = useMarkdownContentStore((s) => s.isChange);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const tier = useToolbarTier(toolbarRef);

  const exec = (fn: (view: EditorView) => void) => {
    if (editorView) {
      fn(editorView);
    }
  };

  const shownTools = formatTools.filter((tool) =>
    isVisibleAt(tool.visibleFrom, tier)
  );
  const overflowItems = formatTools
    .filter((tool) => !isVisibleAt(tool.visibleFrom, tier))
    .map((tool) => ({
      icon: tool.icon,
      label: tool.label,
      onClick: () => exec(tool.run),
    }));
  // 分隔线只在完整一排时出现；收窄后按钮少了，再分组反而占地方
  const showSeparators = tier === "full";

  return (
    <div
      className="flex shrink-0 items-center justify-between gap-2 px-2.5 py-2.5"
      ref={toolbarRef}
    >
      {/* 格式工具药丸：按面板宽度分三档，放不下的次要按钮收进「更多格式」，不再靠横向滚动 */}
      <div className="ds-raised ds-scrollbar-none flex h-9 min-w-0 items-center gap-0.5 overflow-x-auto rounded-full px-1">
        {shownTools.map((tool, index) => (
          <Fragment key={tool.label}>
            {showSeparators &&
            index > 0 &&
            shownTools[index - 1].group !== tool.group ? (
              <ToolbarSeparator />
            ) : null}
            <ToolbarButton
              icon={tool.icon}
              label={tool.label}
              onClick={() => exec(tool.run)}
            />
          </Fragment>
        ))}
        <AutoSplitToggle />
        {showSeparators ? <ToolbarSeparator /> : null}
        <InsertImageButton editorView={editorView} />
        {overflowItems.length > 0 ? (
          <ToolbarOverflowMenu items={overflowItems} />
        ) : null}
      </div>

      {/* 文档操作：撤销、模板与重置，和格式工具分开成右侧一组 */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="ds-raised flex h-9 items-center gap-0.5 rounded-full px-1">
          <ToolbarButton
            icon={ArrowTurnBackwardIcon}
            label="撤销"
            onClick={() => exec(undo)}
          />
          <TemplatePicker />
          {/* 最窄一档：重置收成图标，并进这一组 */}
          {isChange && tier === "narrow" ? (
            <ToolbarButton
              icon={ArrowReloadHorizontalIcon}
              label="重置"
              onClick={resetContent}
            />
          ) : null}
        </div>
        {isChange && tier !== "narrow" ? (
          <Button onClick={resetContent} size="sm" variant="ghost">
            <HugeiconsIcon
              className="size-[13px]"
              icon={ArrowReloadHorizontalIcon}
            />
            重置
          </Button>
        ) : null}
      </div>
    </div>
  );
};
