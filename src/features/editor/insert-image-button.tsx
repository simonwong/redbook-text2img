/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import type { EditorView } from "@codemirror/view";
import { Image02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { imageInputError, importContentImages } from "./image-input";

export function InsertImageButton({
  editorView,
}: {
  editorView: EditorView | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const sessionOnly = useSyncExternalStore(
    imageAssets.subscribe,
    imageAssets.isSessionOnly,
    () => false
  );

  async function insert(source: Blob[] | string) {
    if (!editorView || busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await importContentImages(editorView, source);
      setOpen(false);
      setUrl("");
    } catch (failure) {
      setError(imageInputError(failure));
    } finally {
      setBusy(false);
    }
  }
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      insert([file]);
    }
  }
  function handleLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    insert(url.trim());
  }
  return (
    <>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          aria-label="插入图片"
          className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-ink-2 hover:bg-[var(--ds-well)] disabled:opacity-50"
          disabled={busy || !editorView}
        >
          <HugeiconsIcon className="size-4" icon={Image02Icon} />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-72 max-w-[calc(100vw-2rem)]"
          finalFocus={false}
        >
          <PopoverTitle>插入图片</PopoverTitle>
          <Button
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            type="button"
            variant="raised"
          >
            选择本地文件
          </Button>
          <form className="flex flex-col gap-2" onSubmit={handleLink}>
            <label className="text-ink-2" htmlFor="content-image-url">
              粘贴链接
            </label>
            <input
              aria-label="图片链接"
              className="ds-input min-h-11 w-full px-3"
              disabled={busy}
              id="content-image-url"
              inputMode="url"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
              type="text"
              value={url}
            />
            <Button
              disabled={busy || !url.trim()}
              type="submit"
              variant="raised"
            >
              {busy ? "图片处理中…" : "导入链接"}
            </Button>
          </form>
          {error ? (
            <p className="text-destructive text-xs" role="alert">
              {error}
            </p>
          ) : null}
        </PopoverContent>
      </Popover>
      <input
        accept="image/*"
        aria-label="选择内容图片"
        className="hidden"
        onChange={handleFile}
        ref={inputRef}
        type="file"
      />
      {sessionOnly ? (
        <p
          className="pointer-events-none fixed top-20 right-4 left-4 z-50 rounded-lg border bg-background p-3 text-sm shadow-md md:left-auto md:max-w-sm"
          role="status"
        >
          图片仅在本次会话保留，关闭页面后将丢失。浏览器本地图片存储不可用。
        </p>
      ) : null}
    </>
  );
}
