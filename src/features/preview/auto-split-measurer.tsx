"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  autoSplit,
  type BlockLines,
  type SplitUnit,
} from "@/lib/auto-split/auto-split";
import type { ImageSegment } from "@/lib/markdown-parser";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { ImagePreview } from "./image-preview";

/** 一个分段最多续出的张数，防止异常内容让拆分无限进行 */
const MAX_DEPTH = 40;
const OVERFLOW_TOLERANCE = 1;
const measurePageNumber = { current: 1, total: 1 };

interface AutoSplitMeasurerProps {
  depth?: number;
  onPages: (rootId: string, pages: ImageSegment[]) => void;
  rootId: string;
  segment: ImageSegment;
}

const TOP_ALIGNED = new Set(["flex-start", "normal", "start"]);

const unitOf = (
  element: Element,
  line: number,
  tagName: string,
  countTrailingMargin: boolean
): SplitUnit => {
  const rect = element.getBoundingClientRect();
  // 内容区是纵向 flex，外边距不折叠。内容顶对齐时，页尾单位的下外边距只是无害地垂出去；
  // 居中或沉底（封面版式）时它会把整块内容往上顶，必须算进高度
  const trailingMargin = countTrailingMargin
    ? Number.parseFloat(getComputedStyle(element).marginBottom)
    : 0;
  return {
    bottom: rect.bottom + trailingMargin,
    isHeading: autoSplit.isHeadingTag(tagName),
    line,
    top: rect.top,
  };
};

/** 把渲染出的顶层元素和源码行号一一对上；对不上时返回空，宁可不拆也不拆错 */
const readUnits = (content: HTMLElement, blocks: BlockLines[]): SplitUnit[] => {
  const countTrailingMargin = !TOP_ALIGNED.has(
    getComputedStyle(content).justifyContent
  );
  const elements = Array.from(content.children);
  if (elements.length !== blocks.length) {
    return [];
  }
  return blocks.flatMap((block, index) => {
    const element = elements[index];
    const items = Array.from(element.children).filter(
      (child) => child.tagName === "LI"
    );
    if (items.length > 1 && items.length === block.itemLines.length) {
      return items.map((item, itemIndex) =>
        unitOf(item, block.itemLines[itemIndex], "li", countTrailingMargin)
      );
    }
    return [unitOf(element, block.line, block.tagName, countTrailingMargin)];
  });
};

const measureSplitLine = (
  content: HTMLElement,
  blocks: BlockLines[]
): number | null => {
  const units = readUnits(content, blocks);
  const first = content.firstElementChild;
  if (!(first && units.length > 0)) {
    return null;
  }
  const contentStyle = getComputedStyle(content);
  const available =
    content.clientHeight -
    Number.parseFloat(contentStyle.paddingTop) -
    Number.parseFloat(contentStyle.paddingBottom);
  const origin =
    units[0].top - Number.parseFloat(getComputedStyle(first).marginTop);
  // 封面内容居中或沉底时，放不下的部分会从顶边溢出，scrollHeight 量不到，
  // 所以再按内容自身的总高度判断一次
  const extent = (units.at(-1)?.bottom ?? origin) - origin;
  return autoSplit.findSplitLine({
    available,
    isOverflowing:
      extent - available > OVERFLOW_TOLERANCE ||
      content.scrollHeight - content.clientHeight > OVERFLOW_TOLERANCE,
    origin,
    units,
  });
};

/**
 * 自动拆分的量高度副本：按真实样式把一张卡片渲染在看不见的地方，找出放不下的第一行，
 * 前半留作这一张，后半交给下一层同样处理，直到放得下为止，再把整串结果逐层报回去。
 * 逐层重新渲染是因为续页用的是正文样式，高度不能拿封面的排版去推算。
 */
export const AutoSplitMeasurer = ({
  depth = 0,
  onPages,
  rootId,
  segment,
}: AutoSplitMeasurerProps) => {
  const { currentThemeId, customThemes, overrides } = useContentThemeStore();
  const { signature, showPageNumber } = useWatermarkStore();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const blockLinesRef = useRef<BlockLines[]>([]);
  const [splitLine, setSplitLine] = useState<number | null>(null);
  const [restPages, setRestPages] = useState<ImageSegment[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 内容、主题、样式配置、署名/页码变化后都要重新量
  useLayoutEffect(() => {
    const content = contentRef.current;
    // biome-ignore lint/suspicious/noUnnecessaryConditions: 续页是图片页时没有内容区，ref 为空
    if (!content || depth >= MAX_DEPTH) {
      setSplitLine(null);
      return;
    }
    const measure = () =>
      setSplitLine(measureSplitLine(content, blockLinesRef.current));
    measure();
    content.addEventListener("load", measure, true);
    const observer = new MutationObserver(measure);
    observer.observe(content, { childList: true, subtree: true });
    return () => {
      content.removeEventListener("load", measure, true);
      observer.disconnect();
    };
  }, [
    depth,
    segment.content,
    currentThemeId,
    customThemes,
    overrides,
    signature,
    showPageNumber,
  ]);

  const parts = useMemo(
    () => (splitLine ? autoSplit.splitSegment(segment, splitLine) : null),
    [segment, splitLine]
  );
  const rest = parts?.[1];
  const handleRestPages = useCallback(
    (_rootId: string, pages: ImageSegment[]) => setRestPages(pages),
    []
  );

  useLayoutEffect(() => {
    if (!parts) {
      onPages(rootId, [segment]);
      return;
    }
    const [head, tail] = parts;
    const tailPages = restPages[0]?.id === tail.id ? restPages : [tail];
    onPages(rootId, [head, ...tailPages]);
  }, [onPages, parts, restPages, rootId, segment]);

  return (
    <>
      <ImagePreview
        blockLinesRef={blockLinesRef}
        contentRef={contentRef}
        measureOnly
        pageNumber={measurePageNumber}
        segment={segment}
      />
      {rest ? (
        <AutoSplitMeasurer
          depth={depth + 1}
          onPages={handleRestPages}
          rootId={rest.id}
          segment={rest}
        />
      ) : null}
    </>
  );
};
