export interface ImageSegment {
  id: string;
  title: string;
  content: string;
  isFirstImage: boolean;
  type: 'h1' | 'h2' | 'content';
}

export function parseMarkdownToImages(markdown: string): ImageSegment[] {
  const segments: ImageSegment[] = [];
  const lines = markdown.split('\n');

  let currentSegment: ImageSegment | null = null;
  let segmentId = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 处理一级标题 - 作为首图
    if (trimmedLine.startsWith('# ')) {
      if (currentSegment) {
        segments.push(currentSegment);
      }

      segmentId++;
      currentSegment = {
        id: `segment-${segmentId}`,
        title: trimmedLine.substring(2).trim(),
        content: trimmedLine,
        isFirstImage: segments.length === 0,
        type: 'h1',
      };
    }
    // 处理二级标题 - 开始新的图片段落
    else if (trimmedLine.startsWith('## ')) {
      if (currentSegment) {
        segments.push(currentSegment);
      }

      segmentId++;
      currentSegment = {
        id: `segment-${segmentId}`,
        title: trimmedLine.substring(3).trim(),
        content: trimmedLine,
        isFirstImage: segments.length === 0,
        type: 'h2',
      };
    }
    // 处理其他级别标题和内容
    else if (trimmedLine || currentSegment) {
      if (currentSegment) {
        currentSegment.content += '\n' + line;
      } else if (trimmedLine) {
        // 如果没有当前段落但有内容，创建一个默认段落
        segmentId++;
        currentSegment = {
          id: `segment-${segmentId}`,
          title: '内容',
          content: line,
          isFirstImage: segments.length === 0,
          type: 'content',
        };
      }
    }
  }

  // 添加最后一个段落
  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments.filter((segment) => segment.content.trim());
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
