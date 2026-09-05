"use client";

import { useEffect, useState } from "react";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";

const OVERFLOW_TOLERANCE = 1;

export interface ContentOverflow {
  /** 内容区裁切边（内容元素底边）到导出节点顶边的距离，卡片逻辑像素，未缩放 */
  cutOffset: number;
  isOverflowing: boolean;
}

const noOverflow: ContentOverflow = { cutOffset: 0, isOverflowing: false };

/**
 * 检测预览卡片内容是否超出可视高度（超出部分导出时会被截断），并给出裁切边的位置。
 * 比较内容元素的 scrollHeight 与 clientHeight，
 * 在内容、主题、密度/字体调整、署名/页码（水印挤压内容区）变化时重新测量。
 * 裁切边位置按导出节点（.img-preview）的实际缩放比换算回逻辑像素，供缩放层内的覆盖物定位。
 */
export function useContentOverflow(
  contentRef: React.RefObject<HTMLDivElement | null>,
  content: string
): ContentOverflow {
  const { currentThemeId, customThemes, overrides } = useContentThemeStore();
  const { signature, showPageNumber } = useWatermarkStore();
  const [overflow, setOverflow] = useState<ContentOverflow>(noOverflow);

  // biome-ignore lint/correctness/useExhaustiveDependencies: content/theme/configuration/watermark 变化后需重新测量溢出状态
  useEffect(() => {
    const el = contentRef.current;
    const root = el?.closest<HTMLElement>(".img-preview");
    if (!(el && root)) {
      setOverflow(noOverflow);
      return;
    }
    const isOverflowing =
      el.scrollHeight - el.clientHeight > OVERFLOW_TOLERANCE;
    const rootRect = root.getBoundingClientRect();
    const scale = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1;
    const cutOffset =
      (el.getBoundingClientRect().bottom - rootRect.top) / scale;
    setOverflow({ cutOffset, isOverflowing });
  }, [
    content,
    currentThemeId,
    customThemes,
    overrides,
    signature,
    showPageNumber,
  ]);

  return overflow;
}
