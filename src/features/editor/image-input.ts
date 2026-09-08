import { EditorView } from "@codemirror/view";
import { imageAssets } from "../../lib/image-assets/image-assets";
import { fetchRemoteImage } from "../../lib/image-assets/remote-image";
import {
  ImageImportError,
  imageImportErrors,
} from "../../lib/image-proxy/errors";
import { imageReference } from "../../lib/image-reference";
import { insertContentImage } from "./markdown-commands";

interface Range {
  from: number;
  to: number;
}
const pending = new WeakMap<EditorView, Set<Range>>();

class ImageBatchError extends Error {}

export function imageInputError(error: unknown): string {
  if (error instanceof ImageBatchError) {
    return error.message;
  }
  return error instanceof ImageImportError
    ? imageImportErrors[error.code].message
    : "图片无法读取或存入，请换一张图片重试";
}

export async function importContentImages(
  view: EditorView,
  source: Blob[] | string,
  range: Range = view.state.selection.main
): Promise<void> {
  const target = { from: range.from, to: range.to };
  let ranges = pending.get(view);
  if (!ranges) {
    ranges = new Set();
    pending.set(view, ranges);
  }
  ranges.add(target);
  try {
    const files =
      typeof source === "string" ? [await fetchRemoteImage(source)] : source;
    const results = await Promise.allSettled(
      files.map((file) => imageAssets.import(file))
    );
    const ids = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : []
    );
    if (ids.length > 0 && view.dom.isConnected) {
      insertContentImage(
        view,
        ids.map((id) =>
          imageReference.format({ align: "center", id, size: "full" })
        ),
        target
      );
    }
    const failures = results.flatMap((result, index) =>
      result.status === "rejected"
        ? [
            `${files[index] instanceof File ? files[index].name : "图片链接"}：${imageInputError(result.reason)}`,
          ]
        : []
    );
    if (failures.length > 0) {
      throw new ImageBatchError(failures.join("；"));
    }
  } finally {
    ranges.delete(target);
  }
}

export function contentImageEvents(onError: (message: string) => void) {
  function transfer(
    view: EditorView,
    data: DataTransfer | null,
    position?: number | null
  ): boolean {
    const files = Array.from(data?.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) {
      return false;
    }
    const range =
      typeof position === "number"
        ? { from: position, to: position }
        : view.state.selection.main;
    onError("");
    importContentImages(view, files, range).catch((error) =>
      onError(imageInputError(error))
    );
    return true;
  }
  return [
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) {
        return;
      }
      for (const range of pending.get(update.view) ?? []) {
        const collapsed = range.from === range.to;
        range.from = update.changes.mapPos(range.from, 1);
        range.to = collapsed ? range.from : update.changes.mapPos(range.to, 1);
      }
    }),
    EditorView.domEventHandlers({
      drop: (event, view) =>
        transfer(
          view,
          event.dataTransfer,
          view.posAtCoords({ x: event.clientX, y: event.clientY })
        ),
      paste: (event, view) => transfer(view, event.clipboardData),
    }),
  ];
}
