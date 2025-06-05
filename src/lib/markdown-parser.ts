export interface ImageSegment {
  id: string;
  title: string;
  content: string;
  isFirstImage: boolean;
  type: 'content' | 'separator';
}

export function parseMarkdownToImages(markdown: string): ImageSegment[] {
  const segments: ImageSegment[] = [];
  const lines = markdown.split('\n');

  let currentSegment: ImageSegment | null = null;
  let segmentId = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 处理分割线 - 开始新的图片段落
    if (trimmedLine.match(/^-{3,}$/)) {
      if (currentSegment) {
        segments.push(currentSegment);
      }

      segmentId++;
      // 创建新段落，标题使用段落编号
      currentSegment = {
        id: `segment-${segmentId}`,
        title: `图片 ${segmentId}`,
        content: '',
        isFirstImage: false, // 稍后根据内容判断
        type: 'separator',
      };
    }
    // 处理其他内容
    else if (trimmedLine || currentSegment) {
      if (currentSegment) {
        // 如果当前段落的内容为空且是分割线创建的段落，则直接添加内容
        if (currentSegment.content === '') {
          currentSegment.content = line;
        } else {
          currentSegment.content += '\n' + line;
        }
      } else if (trimmedLine) {
        // 如果没有当前段落但有内容，创建一个默认段落（第一个段落）
        segmentId++;
        currentSegment = {
          id: `segment-${segmentId}`,
          title: `图片 ${segmentId}`,
          content: line,
          isFirstImage: false, // 稍后根据内容判断
          type: 'content',
        };
      }
    }
  }

  // 添加最后一个段落
  if (currentSegment) {
    segments.push(currentSegment);
  }

  // 过滤空内容的段落并标记首图
  const validSegments = segments.filter((segment) => segment.content.trim());

  // 标记包含一级标题的段落为首图
  validSegments.forEach((segment) => {
    const hasH1 = segment.content.trim().startsWith('# ');
    segment.isFirstImage = hasH1;

    // 如果包含一级标题，提取标题作为段落标题
    if (hasH1) {
      const h1Match = segment.content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        segment.title = h1Match[1].trim();
      }
    }
  });

  return validSegments;
}

export function formatMarkdownContent(content: string): string {
  return content
    .split('\n')
    .map((line) => {
      const trimmedLine = line.trim();
      // 三到六级标题加粗处理
      if (trimmedLine.match(/^#{3,6}\s/)) {
        const level = trimmedLine.match(/^#+/)?.[0].length || 0;
        const text = trimmedLine.substring(level + 1).trim();
        return `**${text}**`;
      }
      return line;
    })
    .join('\n');
}
