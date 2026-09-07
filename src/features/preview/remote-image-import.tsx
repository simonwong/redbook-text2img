"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { imageInputError } from "@/features/editor/image-input";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { replaceRemoteImage } from "@/lib/image-assets/markdown-images";
import { fetchRemoteImage } from "@/lib/image-assets/remote-image";
import { imageReference } from "@/lib/image-reference";
import { useMarkdownContentStore } from "@/store/markdownContent";

export function RemoteImageImport({ url }: { url: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const importImage = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const id = await imageAssets.import(await fetchRemoteImage(url));
      const state = useMarkdownContentStore.getState();
      const content = replaceRemoteImage(
        state.content,
        url,
        imageReference.format({ align: "center", id, size: "full" })
      );
      if (content === state.content) {
        setError("未找到可改写的图片引用，请从工具栏重新插入图片");
      } else {
        state.setContent(content);
      }
    } catch (cause) {
      setError(imageInputError(cause));
    } finally {
      setBusy(false);
    }
  }, [url]);
  return (
    <span data-export-ignore="true" style={{ display: "block" }}>
      <Button
        disabled={busy}
        onClick={importImage}
        size="sm"
        type="button"
        variant="raised"
      >
        {busy ? "导入中…" : "导入"}
      </Button>
      {Boolean(error) && (
        <span role="alert" style={{ display: "block" }}>
          {error}
        </span>
      )}
    </span>
  );
}
