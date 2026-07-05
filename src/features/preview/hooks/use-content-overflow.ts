"use client";

import { useEffect, useState } from "react";
import { useContentThemeStore } from "@/store/theme";

const OVERFLOW_TOLERANCE = 1;

/**
 * 检测预览卡片内容是否超出可视高度（超出部分导出时会被截断）。
 * 比较内容元素的 scrollHeight 与 clientHeight，
 * 在内容、主题、密度/字体调整变化时重新测量。
 */
export function useContentOverflow(
  contentRef: React.RefObject<HTMLDivElement | null>,
  content: string
): boolean {
  const { currentThemeId, adjustments } = useContentThemeStore();
  const [isOverflowing, setIsOverflowing] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: content/theme/adjustments 变化后需重新测量溢出状态
  useEffect(() => {
    const el = contentRef.current;
    setIsOverflowing(
      el ? el.scrollHeight - el.clientHeight > OVERFLOW_TOLERANCE : false
    );
  }, [content, currentThemeId, adjustments]);

  return isOverflowing;
}
