import { describe, expect, it } from "vitest";
import { parseMarkdownToImages } from "../markdown-parser";
import { autoSplit, type SplitUnit } from "./auto-split";

const unit = (
  line: number,
  top: number,
  bottom: number,
  isHeading = false
): SplitUnit => ({ bottom, isHeading, line, top });

describe("autoSplit.findSplitLine", () => {
  const units = [unit(1, 0, 100), unit(3, 110, 300), unit(5, 310, 520)];

  it("没有溢出时不拆", () => {
    expect(
      autoSplit.findSplitLine({
        available: 400,
        isOverflowing: false,
        origin: 0,
        units,
      })
    ).toBeNull();
  });

  it("从第一个放不下的单位开始挪到下一张", () => {
    expect(
      autoSplit.findSplitLine({
        available: 400,
        isOverflowing: true,
        origin: 0,
        units,
      })
    ).toBe(5);
  });

  it("第一个单位再高也留在当前这张", () => {
    expect(
      autoSplit.findSplitLine({
        available: 50,
        isOverflowing: true,
        origin: 0,
        units,
      })
    ).toBe(3);
  });

  it("只有一个单位时拆不了", () => {
    expect(
      autoSplit.findSplitLine({
        available: 50,
        isOverflowing: true,
        origin: 0,
        units: [unit(1, 0, 900)],
      })
    ).toBeNull();
  });

  it("标题不留在页尾，和后面的内容一起挪走", () => {
    expect(
      autoSplit.findSplitLine({
        available: 400,
        isOverflowing: true,
        origin: 0,
        units: [unit(1, 0, 100), unit(3, 110, 160, true), unit(5, 170, 520)],
      })
    ).toBe(3);
  });

  it("溢出但每个单位都量得下时挪走最后一个", () => {
    expect(
      autoSplit.findSplitLine({
        available: 600,
        isOverflowing: true,
        origin: 0,
        units,
      })
    ).toBe(5);
  });
});

describe("autoSplit.collectBlockLines", () => {
  it("读出顶层块的行号，列表带上每一项的行号", () => {
    const at = (line: number) => ({ start: { line } });
    expect(
      autoSplit.collectBlockLines({
        children: [
          { position: at(1), tagName: "h2", type: "element" },
          { type: "text" },
          {
            children: [
              { position: at(3), tagName: "li", type: "element" },
              { type: "text" },
              { position: at(4), tagName: "li", type: "element" },
            ],
            position: at(3),
            tagName: "ul",
            type: "element",
          },
        ],
        type: "root",
      })
    ).toEqual([
      { itemLines: [], line: 1, tagName: "h2" },
      { itemLines: [3, 4], line: 3, tagName: "ul" },
    ]);
  });
});

describe("autoSplit.splitSegment", () => {
  const [cover] = parseMarkdownToImages("# 标题\n\n第一段\n\n- 甲\n- 乙");

  it("前一张保留封面身份，续页按正文处理", () => {
    const result = autoSplit.splitSegment(cover, 5);
    expect(result?.[0]).toMatchObject({
      content: "# 标题\n\n第一段\n",
      id: "segment-1",
      isCover: true,
    });
    expect(result?.[1]).toMatchObject({
      content: "- 甲\n- 乙",
      id: "segment-1-next",
      isCover: false,
      title: "标题",
    });
  });

  it("可以在列表项之间拆开", () => {
    expect(autoSplit.splitSegment(cover, 6)?.[1].content).toBe("- 乙");
  });

  it("任何一边为空时不拆", () => {
    expect(autoSplit.splitSegment(cover, 1)).toBeNull();
    expect(autoSplit.splitSegment(cover, 99)).toBeNull();
  });
});
