'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { imageStyles, baseStyle } from '@/lib/image-styles';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const currentStyle = imageStyles.find(style => style.id === selectedStyle) || imageStyles[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">图片样式</h3>
        <Badge variant="outline" className="text-xs">
          {imageStyles.length} 种样式
        </Badge>
      </div>
      
      <Select value={selectedStyle} onValueChange={onStyleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择图片样式" />
        </SelectTrigger>
        <SelectContent>
          {imageStyles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{style.name}</span>
                <span className="text-xs text-gray-500">{style.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* 当前样式预览 */}
      <div className="p-3 rounded-lg border bg-gray-50">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-8 rounded border"
            style={{ 
              background: currentStyle.styles.container?.background || baseStyle.styles.container?.background || '#fff'
            }}
          />
          <div className="flex-1">
            <div className="text-sm font-medium">{currentStyle.name}</div>
            <div className="text-xs text-gray-500">{currentStyle.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 