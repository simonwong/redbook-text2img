const SEPARATOR_PATTERN = /^-{3,}$/;
const H1_PATTERN = /^#\s+(.+)$/m;

export interface ImageSegment {
  id: string;
  title: string;
  content: string;
  isFirstImage: boolean;
  type: 'content' | 'separator';
}

// 辅助函数：创建新段落
const createSegment = (
  segmentId: number,
  type: 'content' | 'separator'
): ImageSegment => ({
  id: `segment-${segmentId}`,
  title: `图片 ${segmentId}`,
  content: '',
  isFirstImage: false,
  type,
});

// 辅助函数：处理段落内容
const addContentToSegment = (segment: ImageSegment, line: string): void => {
  if (segment.content === '') {
    segment.content = line;
  } else {
    segment.content += `\n${line}`;
  }
};

// 辅助函数：处理分割线
const handleSeparator = (
  segments: ImageSegment[],
  currentSegment: ImageSegment | null,
  segmentId: number
): [ImageSegment, number] => {
  if (currentSegment) {
    segments.push(currentSegment);
  }
  const newSegmentId = segmentId + 1;
  return [createSegment(newSegmentId, 'separator'), newSegmentId];
};

// 辅助函数：处理内容行
const handleContentLine = (
  currentSegment: ImageSegment | null,
  line: string,
  trimmedLine: string,
  segmentId: number
): [ImageSegment | null, number] => {
  if (currentSegment) {
    addContentToSegment(currentSegment, line);
    return [currentSegment, segmentId];
  }
  if (trimmedLine) {
    const newSegmentId = segmentId + 1;
    const newSegment = createSegment(newSegmentId, 'content');
    newSegment.content = line;
    return [newSegment, newSegmentId];
  }
  return [null, segmentId];
};

// 辅助函数：标记首图并提取标题
const processSegmentTitles = (segments: ImageSegment[]): void => {
  for (const segment of segments) {
    const hasH1 = segment.content.trim().startsWith('# ');
    segment.isFirstImage = hasH1;

    if (hasH1) {
      const h1Match = segment.content.match(H1_PATTERN);
      if (h1Match) {
        segment.title = h1Match[1].trim();
      }
    }
  }
};

export const parseMarkdownToImages = (markdown: string): ImageSegment[] => {
  const segments: ImageSegment[] = [];
  const lines = markdown.split('\n');

  let currentSegment: ImageSegment | null = null;
  let segmentId = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.match(SEPARATOR_PATTERN)) {
      [currentSegment, segmentId] = handleSeparator(
        segments,
        currentSegment,
        segmentId
      );
    } else if (trimmedLine || currentSegment) {
      [currentSegment, segmentId] = handleContentLine(
        currentSegment,
        line,
        trimmedLine,
        segmentId
      );
    }
  }

  // 添加最后一个段落
  if (currentSegment) {
    segments.push(currentSegment);
  }

  // 过滤空内容的段落并标记首图
  const validSegments = segments.filter((segment) => segment.content.trim());
  processSegmentTitles(validSegments);

  return validSegments;
};
