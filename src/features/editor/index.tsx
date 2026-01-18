"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/easy/card";
import { Button } from "@/components/ui/button";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { MarkdownEditor } from "./markdown-editor";

export const EditorCard = () => {
  const { resetContent, isChange } = useMarkdownContentStore();

  return (
    <Card
      action={
        isChange && (
          <Button onClick={resetContent} size="sm" variant="outline">
            <HugeiconsIcon
              className="h-4 w-4"
              icon={ArrowReloadHorizontalIcon}
            />
            重置示例
          </Button>
        )
      }
      className="flex-1 gap-3"
      title="编辑器"
    >
      <MarkdownEditor placeholder="在这里输入您的 Markdown 内容..." />
    </Card>
  );
};
