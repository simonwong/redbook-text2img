"use client";

import { type CSSProperties, useEffect, useSyncExternalStore } from "react";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { imageReference } from "@/lib/image-reference";

interface ContentImageProps {
  alt?: string;
  src?: string | Blob;
  style: CSSProperties;
}

export function ContentImage({ alt, src, style }: ContentImageProps) {
  const reference = typeof src === "string" ? imageReference.parse(src) : null;
  const id = reference?.id ?? "";
  const snapshot = useSyncExternalStore(
    imageAssets.subscribe,
    () => imageAssets.snapshot(id),
    () => undefined
  );
  useEffect(() => {
    if (id) {
      imageAssets.load(id);
    }
  }, [id]);

  if (reference && snapshot?.status === "ready") {
    // biome-ignore lint/correctness/useImageSize: Intrinsic ratio with CSS auto sizing; export waits for decode.
    // biome-ignore lint/performance/noImgElement: Session Blob URLs are already compressed and must render locally for export.
    return <img alt={alt ?? "内容图片"} src={snapshot.url} style={style} />;
  }
  const loading = Boolean(reference && !snapshot);
  let message = "图片未导入，请先上传本地图片";
  if (reference) {
    message = loading ? "图片加载中" : "图片未找到";
  }
  return (
    <span
      data-image-loading={loading ? "true" : undefined}
      style={{
        border: "1px dashed currentColor",
        display: "inline-block",
        maxWidth: "100%",
        padding: "16px",
      }}
    >
      {message}：{alt || "内容图片"}
    </span>
  );
}
