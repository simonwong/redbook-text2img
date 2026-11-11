import { type ImageSegment, parseMarkdownToImages } from "../markdown-parser";

const HEADING_TAG = /^h[1-6]$/;
const LIST_TAGS = new Set(["ol", "ul"]);
const FIT_TOLERANCE = 1;

/** 渲染树里带源码位置的节点，只取自动拆分用得到的字段 */
export interface PositionedNode {
  children?: PositionedNode[];
  position?: { start: { line: number } };
  tagName?: string;
  type: string;
}

/** 一个顶层内容块：起始行（1 起）、标签名，列表另带每个列表项的起始行 */
export interface BlockLines {
  itemLines: number[];
  line: number;
  tagName: string;
}

/** 一个可以整体挪到下一张的最小单位：普通块，或列表里的一项 */
export interface SplitUnit {
  bottom: number;
  isHeading: boolean;
  line: number;
  top: number;
}

interface SplitMeasurement {
  /** 内容区可用高度 */
  available: number;
  /** 渲染结果是否真的溢出；没有溢出时不拆 */
  isOverflowing: boolean;
  /** 内容起点（第一个单位的上外边距顶边） */
  origin: number;
  units: SplitUnit[];
}

const elementChildren = (node: PositionedNode): PositionedNode[] =>
  (node.children ?? []).filter(
    (child) => child.type === "element" && child.position
  );

/** 从渲染树读出每个顶层内容块的源码行号，顺序与渲染出的顶层元素一致 */
const collectBlockLines = (root: PositionedNode): BlockLines[] =>
  elementChildren(root).map((block) => {
    const tagName = block.tagName ?? "";
    return {
      itemLines: LIST_TAGS.has(tagName)
        ? elementChildren(block).map((item) => item.position?.start.line ?? 0)
        : [],
      line: block.position?.start.line ?? 0,
      tagName,
    };
  });

/**
 * 找出这一张放不下、应当挪到下一张的第一行（1 起）。返回 null 表示不用拆或拆不了：
 * 没有溢出，或者只有一个单位（单个超长段落无法再拆，交给截断提示）。
 * 每张至少留一个单位；标题不留在页尾，和它后面的内容一起挪走。
 */
const findSplitLine = ({
  available,
  isOverflowing,
  origin,
  units,
}: SplitMeasurement): number | null => {
  if (!isOverflowing || units.length < 2) {
    return null;
  }
  let breakIndex = units.findIndex(
    (unit, index) =>
      index > 0 && unit.bottom - origin > available + FIT_TOLERANCE
  );
  if (breakIndex === -1) {
    // 溢出来自外边距等零头：把最后一个单位挪走
    breakIndex = units.length - 1;
  }
  while (breakIndex > 1 && units[breakIndex - 1].isHeading) {
    breakIndex -= 1;
  }
  const { line } = units[breakIndex];
  return line > units[0].line ? line : null;
};

/**
 * 在指定行把一张卡片拆成两张：前一张保留原来的封面身份，续页一律按正文处理。
 * 行号无效或任何一边为空时返回 null。
 */
const splitSegment = (
  segment: ImageSegment,
  line: number
): [ImageSegment, ImageSegment] | null => {
  const lines = segment.content.split("\n");
  const headContent = lines.slice(0, line - 1).join("\n");
  const restContent = lines.slice(line - 1).join("\n");
  const [head] = parseMarkdownToImages(headContent);
  const [rest] = parseMarkdownToImages(restContent);
  if (!(head && rest) || line < 2) {
    return null;
  }
  return [
    { ...head, id: segment.id, isCover: segment.isCover, title: segment.title },
    { ...rest, id: `${segment.id}-next`, isCover: false, title: segment.title },
  ];
};

export const autoSplit = {
  collectBlockLines,
  findSplitLine,
  isHeadingTag: (tagName: string) => HEADING_TAG.test(tagName),
  splitSegment,
};
