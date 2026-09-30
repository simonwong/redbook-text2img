import { imageReference } from "./image-reference";

const SEPARATOR_PATTERN = /^-{3,}$/;
const H1_PATTERN = /^#\s+(.+)$/m;

export interface ImageSegment {
  content: string;
  id: string;
  image: { alt: string; source: string } | null;
  isCover: boolean;
  isImagePage: boolean;
  title: string;
}

/**
 * 逐行标出分页分割线。围栏代码块内的 `---` 同样分页：
 * 这是拆分长代码块的唯一办法，属于有意行为。
 */
export const findSeparatorLines = (lines: string[]): boolean[] =>
  lines.map((line) => SEPARATOR_PATTERN.test(line.trim()));

const createSegment = (segmentId: number, content = ""): ImageSegment => ({
  content,
  id: `segment-${segmentId}`,
  image: null,
  isCover: false,
  isImagePage: false,
  title: `图片 ${segmentId}`,
});

// 标记图片页与封面，并提取标题
const processSegmentTitles = (segments: ImageSegment[]): void => {
  for (const segment of segments) {
    const lines = segment.content.split("\n").filter((line) => line.trim());
    const image = lines.length === 1 ? imageReference.single(lines[0]) : null;
    segment.image = image ? { alt: image.alt, source: image.source } : null;
    segment.isImagePage = Boolean(image);
    if (segment.isImagePage) {
      segment.title = "图片页";
    }
    const firstText =
      lines.find((line) => !imageReference.single(line, true))?.trim() ?? "";
    // 包含 # 一级标题的视为封面
    segment.isCover = firstText.startsWith("# ");

    if (segment.isCover) {
      const h1Match = firstText.match(H1_PATTERN);
      if (h1Match) {
        segment.title = h1Match[1].trim();
      }
    }
  }
};

export const parseMarkdownToImages = (markdown: string): ImageSegment[] => {
  const segments: ImageSegment[] = [];
  const lines = markdown.split("\n");
  const separators = findSeparatorLines(lines);

  let currentSegment: ImageSegment | null = null;
  let segmentId = 0;

  for (const [index, line] of lines.entries()) {
    if (separators[index]) {
      if (currentSegment) {
        segments.push(currentSegment);
      }
      segmentId += 1;
      currentSegment = createSegment(segmentId);
    } else if (currentSegment) {
      currentSegment.content =
        currentSegment.content === ""
          ? line
          : `${currentSegment.content}\n${line}`;
    } else if (line.trim()) {
      segmentId += 1;
      currentSegment = createSegment(segmentId, line);
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  const validSegments = segments.filter((segment) => segment.content.trim());
  processSegmentTitles(validSegments);

  return validSegments;
};
