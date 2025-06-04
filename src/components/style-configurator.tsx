'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ContentConfig } from '@/lib/image-style-config';
import { StyleManager } from '@/lib/style-manager';
import {
  BackgroundOptions,
  FontColorOptions,
  FontSizeOptions,
  horizontalOptions,
  VerticalOptions,
} from '@/lib/preset-config';
import { Palette, Trash2 } from 'lucide-react';
import { useStyleConfigStore } from '@/store/styleConfig';
import { defaultStyles, defaultStyleIds } from '@/lib/default-styles';
import { mergeCoverConfig } from '@/lib/style-generator';

const ConfigForm = ({ config }: { config: ContentConfig }) => (
  <>
    {/* 大小设置 */}
    <div className="space-y-2">
      <label className="text-sm font-medium">大小</label>
      <div className="flex gap-2">
        <Select value={config.size}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FontSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* 颜色设置 */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">标题颜色</label>
        <Select value={config.titleColor}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FontColorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">内容颜色</label>
        <Select value={config.contentColor}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FontColorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* 背景设置 */}
    <div className="space-y-2">
      <label className="text-sm font-medium">背景</label>
      <Select value={config.background}>
        <SelectTrigger>
          <SelectValue placeholder="选择背景" />
        </SelectTrigger>
        <SelectContent>
          {BackgroundOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ background: option.value }} />
                <span className="text-xs">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* 位置设置 */}
    <div className="space-y-2">
      <label className="text-sm font-medium">位置</label>
      <div className="grid grid-cols-2 gap-2">
        <Select value={config.vertical}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VerticalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={config.horizontal}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {horizontalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </>
);

export function StyleConfigurator() {
  const [newStyleName, setNewStyleName] = useState('');

  const { styleConfig, setStyleConfig, isChange } = useStyleConfigStore();

  const handleStyleSelect = (styleId: string) => {
    setStyleConfig(StyleManager.getStyleById(styleId)!);
  };

  const isBuiltIn = defaultStyleIds.includes(styleConfig.id);

  return (
    <div className="space-y-4">
      {/* 样式选择器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4" />
            样式选择
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={styleConfig?.id} onValueChange={handleStyleSelect}>
            <SelectTrigger className="data-[size=default]:h-auto whitespace-normal text-left">
              <SelectValue placeholder="选择样式" />
            </SelectTrigger>
            <SelectContent>
              {defaultStyles.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{style.name}</span>
                      {defaultStyleIds.includes(style.id) && (
                        <Badge variant="secondary" className="text-xs">
                          内置
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{style.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 样式操作按钮 */}
          <div className="flex gap-2">
            {!isBuiltIn && (
              <Button variant="outline" size="sm" disabled={!styleConfig || isBuiltIn}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {isChange && (
        <Card>
          <CardContent className="pt-4">
            {isBuiltIn && (
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">新样式名称</label>
                <Input
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder={`自定义 ${styleConfig.name}`}
                />
              </div>
            )}

            {/* <div className="flex gap-2">
              <Button onClick={saveEditing} className="flex-1">
                <Save className="w-3 h-3 mr-1" />
                {isBuiltIn ? '保存为新样式' : '保存更改'}
              </Button>
              <Button variant="outline" onClick={cancelEditing}>
                取消
              </Button>
            </div> */}
          </CardContent>
        </Card>
      )}

      {/* 内容设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">内容设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConfigForm config={styleConfig.content} />
        </CardContent>
      </Card>

      {/* 封面设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">封面设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConfigForm config={mergeCoverConfig(styleConfig.content, styleConfig.cover)} />
        </CardContent>
      </Card>
    </div>
  );
}
