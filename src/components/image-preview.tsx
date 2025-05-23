'use client';

import { forwardRef } from 'react';
import { MarkdownRenderer } from './markdown-renderer';
import { ImageSegment } from '@/lib/markdown-parser';
import { ImageStyle } from '@/lib/image-styles';

interface ImagePreviewProps {
  segment: ImageSegment;
  style: ImageStyle;
  index: number;
}

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ segment, style, index }, ref) => {
    return (
      <div
        ref={ref}
        className="image-preview relative overflow-hidden"
        style={{
          width: `${style.width}px`,
          height: `${style.height}px`,
          background: style.backgroundGradient,
        }}
      >
        <div className={`${style.containerClass} relative flex flex-col justify-between`} style={{ width: '100%', height: '100%' }}>
          {/* 标题部分 */}
          {segment.title && (
            <div className={style.titleClass}>
              {segment.title}
            </div>
          )}
          
          {/* 内容部分 */}
          <div className={`${style.contentClass} flex-1 overflow-hidden`}>
            <MarkdownRenderer content={segment.content} />
          </div>
          
          {/* 底部装饰 */}
          <div className="text-xs opacity-50 text-right mt-4">
            小红书图片 {index + 1}
          </div>
        </div>
      </div>
    );
  }
);

ImagePreview.displayName = 'ImagePreview'; 