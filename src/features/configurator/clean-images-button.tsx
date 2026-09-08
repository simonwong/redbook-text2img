"use client";

import { type ReactNode, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { unusedImageIds } from "@/lib/image-assets/markdown-images";
import { useMarkdownContentStore } from "@/store/markdownContent";

export function CleanImagesButton({
  onMessage,
  render,
  visible,
}: {
  onMessage: (message: string) => void;
  render: (action: ReactNode, confirmation: ReactNode) => ReactNode;
  visible: boolean;
}) {
  const [candidates, setCandidates] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const inspect = useCallback(async () => {
    setBusy(true);
    onMessage("");
    try {
      setCandidates(
        unusedImageIds(
          await imageAssets.list(),
          useMarkdownContentStore.getState().content
        )
      );
    } catch {
      onMessage("无法读取图片库，请重试");
    } finally {
      setBusy(false);
    }
  }, [onMessage]);
  const clean = useCallback(async () => {
    setBusy(true);
    let deleted = 0;
    try {
      for (const id of candidates ?? []) {
        if (
          unusedImageIds([id], useMarkdownContentStore.getState().content)
            .length
        ) {
          // biome-ignore lint/performance/noAwaitInLoops: Recheck current content before each deletion and report partial completion.
          await imageAssets.delete(id);
          deleted += 1;
        }
      }
      onMessage(`已清理 ${deleted} 张图片`);
    } catch {
      onMessage(`已清理 ${deleted} 张图片，其余删除失败，请重试`);
    } finally {
      setCandidates(null);
      setBusy(false);
    }
  }, [candidates, onMessage]);
  const cancel = useCallback(() => setCandidates(null), []);
  return render(
    visible ? (
      <Button
        disabled={busy}
        onClick={inspect}
        size="sm"
        type="button"
        variant="ghost"
      >
        清理未使用图片
      </Button>
    ) : null,
    candidates === null ? null : (
      <div className="space-y-2 text-ink-2 text-xs">
        <p role="status">
          发现 {candidates.length}{" "}
          张未使用图片。多标签页只以当前内容为准，清理后无法恢复。
        </p>
        <div className="flex gap-2">
          <Button
            disabled={busy || candidates.length === 0}
            onClick={clean}
            size="sm"
            type="button"
            variant="secondary"
          >
            确认清理
          </Button>
          <Button
            disabled={busy}
            onClick={cancel}
            size="sm"
            type="button"
            variant="ghost"
          >
            取消
          </Button>
        </div>
      </div>
    )
  );
}
