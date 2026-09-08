/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import type { EditorView } from "@codemirror/view";
import { Image02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
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
import { showImageNotice } from "./image-notices";

export function InsertImageButton({
  editorView,
}: {
  editorView: EditorView | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const sessionOnly = useSyncExternalStore(
    imageAssets.subscribe,
    imageAssets.isSessionOnly,
    () => false
  );

  useEffect(() => {
    if (sessionOnly) {
      showImageNotice(
        "图片仅在本次会话保留，关闭页面后将丢失。浏览器本地图片存储不可用。",
        "status"
      );
    }
  }, [sessionOnly]);

  async function insert(source: Blob[] | string) {
    if (!editorView || busy) {
      return;
    }
    setBusy(true);
    try {
      await importContentImages(editorView, source);
      setOpen(false);
      setUrl("");
    } catch (failure) {
      showImageNotice(imageInputError(failure));
    } finally {
      setBusy(false);
    }
  }
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) {
      insert(files);
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
          align="start"
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
        </PopoverContent>
      </Popover>
      <input
        accept="image/*"
        aria-label="选择内容图片"
        className="hidden"
        multiple
        onChange={handleFile}
        ref={inputRef}
        type="file"
      />
    </>
  );
}
