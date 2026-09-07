/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import type { EditorView } from "@codemirror/view";
import { Image02Icon } from "@hugeicons/core-free-icons";
import {
  type ChangeEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { imageReference } from "@/lib/image-reference";
import { insertContentImage } from "./markdown-commands";
import { ToolbarButton } from "./toolbar-button";

export function InsertImageButton({
  editorView,
}: {
  editorView: EditorView | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sessionOnly = useSyncExternalStore(
    imageAssets.subscribe,
    imageAssets.isSessionOnly,
    () => false
  );

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!(file && editorView) || busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const id = await imageAssets.import(file);
      insertContentImage(
        editorView,
        imageReference.format({ align: "center", id, size: "full" })
      );
    } catch {
      setError("图片无法读取或存入，请换一张图片重试");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolbarButton
        disabled={busy || !editorView}
        icon={Image02Icon}
        label={busy ? "图片处理中" : "插入图片"}
        onClick={() => {
          if (!busy && editorView) {
            inputRef.current?.click();
          }
        }}
      />
      <input
        accept="image/*"
        aria-label="选择内容图片"
        className="hidden"
        onChange={handleFile}
        ref={inputRef}
        type="file"
      />
      {(sessionOnly || Boolean(error)) && (
        <p
          className="pointer-events-none fixed top-20 right-4 left-4 z-50 rounded-lg border bg-background p-3 text-sm shadow-md md:left-auto md:max-w-sm"
          role="status"
        >
          {error ||
            "图片仅在本次会话保留，关闭页面后将丢失。浏览器本地图片存储不可用。"}
        </p>
      )}
    </>
  );
}
