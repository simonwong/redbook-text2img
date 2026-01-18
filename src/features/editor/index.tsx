"use client";

import {
  ArrowReloadHorizontalIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardWrap } from "@/components/card-wrap";
import { Button } from "@/components/ui/button";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { MarkdownEditor } from "./markdown-editor";

interface EditorCardProps {
  isMobile?: boolean;
  onPreviewClick?: () => void;
  className?: string;
}

export const EditorCard = ({
  isMobile,
  onPreviewClick,
  className,
}: EditorCardProps) => {
  const { resetContent, isChange } = useMarkdownContentStore();

  return (
    <CardWrap
      className={className}
      extra={
        <div className="flex gap-2">
          {isMobile && onPreviewClick && (
            <Button onClick={onPreviewClick} size="sm" variant="outline">
              <HugeiconsIcon className="h-4 w-4" icon={ViewIcon} />
              预览
            </Button>
          )}
          {isChange && (
            <Button onClick={resetContent} size="sm" variant="outline">
              <HugeiconsIcon
                className="h-4 w-4"
                icon={ArrowReloadHorizontalIcon}
              />
              重置示例
            </Button>
          )}
        </div>
      }
      title="编辑器"
    >
      <MarkdownEditor placeholder="在这里输入您的 Markdown 内容..." />
    </CardWrap>
  );
};
