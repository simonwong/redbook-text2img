'use client';

import { Palette, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { Select } from '@/components/enhance/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultStyleIds, defaultStyles } from '@/lib/default-styles';
import type { ContentConfig } from '@/lib/image-style-config';
import {
  BackgroundOptions,
  FontColorOptions,
  FontSizeOptions,
  getBackgroundCss,
  getColorCss,
  HorizontalOptions,
  VerticalOptions,
} from '@/lib/preset-config';
import { mergeCoverConfig } from '@/lib/style-generator';
import { showSettingStore, useStyleConfigStore } from '@/store/styleConfig';

const ConfigForm = ({
  config,
  onConfigChange,
}: {
  config: ContentConfig;
  onConfigChange: (change: Partial<ContentConfig>) => void;
}) => (
  <>
    {/* 大小设置 */}
    <div className="space-y-2">
      <Label className="font-medium text-sm">大小</Label>
      <div className="flex gap-2">
        <Select
          onChange={(v) => onConfigChange({ size: v })}
          options={FontSizeOptions}
          value={config.size}
        />
      </div>
    </div>

    {/* 颜色设置 */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="font-medium text-sm">标题颜色</Label>
        <Select
          onChange={(v) => onConfigChange({ titleColor: v })}
          options={FontColorOptions.map((option) => ({
            label: (
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded border"
                  style={{ background: getColorCss(option.value) }}
                />
                <span className="text-xs">{option.label}</span>
              </div>
            ),
            value: option.value,
          }))}
          value={config.titleColor}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">内容颜色</Label>
        <Select
          onChange={(v) => onConfigChange({ contentColor: v })}
          options={FontColorOptions.map((option) => ({
            label: (
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded border"
                  style={{ background: getColorCss(option.value) }}
                />
                <span className="text-xs">{option.label}</span>
              </div>
            ),
            value: option.value,
          }))}
          value={config.contentColor}
        />
      </div>
    </div>

    {/* 背景设置 */}
    <div className="space-y-2">
      <Label className="font-medium text-sm">背景</Label>
      <Select
        onChange={(v) => onConfigChange({ background: v })}
        options={BackgroundOptions.map((option) => ({
          label: (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border"
                style={{ background: getBackgroundCss(option.value) }}
              />
              <span className="text-xs">{option.label}</span>
            </div>
          ),
          value: option.value,
        }))}
        value={config.background}
      />
    </div>

    {/* 位置设置 */}
    <div className="space-y-2">
      <Label className="font-medium text-sm">位置</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select
          onChange={(v) => onConfigChange({ vertical: v })}
          options={VerticalOptions}
          value={config.vertical}
        />
        <Select
          onChange={(v) => onConfigChange({ horizontal: v })}
          options={HorizontalOptions}
          value={config.horizontal}
        />
      </div>
    </div>
  </>
);

export const Configurator = memo(() => {
  const [newStyleName, setNewStyleName] = useState('');

  const { styleConfig, setStyleConfig, isChange } = useStyleConfigStore();
  const isShowSetting = showSettingStore((state) => state.isShowSetting);
  const handleStyleSelect = (styleId: string) => {
    const selectedStyle = defaultStyles.find((style) => style.id === styleId);
    if (selectedStyle) {
      setStyleConfig(selectedStyle);
    }
  };

  const handleContentChange = (change: Partial<ContentConfig>) => {
    setStyleConfig({
      ...styleConfig,
      content: {
        ...styleConfig.content,
        ...change,
      },
    });
  };

  const handleCoverChange = (change: Partial<ContentConfig>) => {
    setStyleConfig({
      ...styleConfig,
      cover: {
        ...styleConfig.cover,
        ...change,
      },
    });
  };

  const isBuiltIn = defaultStyleIds.includes(styleConfig.id);

  if (!isShowSetting) {
    return null;
  }

  return (
    <div className="w-80 overflow-auto">
      <div className="space-y-4">
        {/* 样式选择器 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4" />
              样式选择
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              className="whitespace-normal text-left data-[size=default]:h-auto"
              onChange={(v) => handleStyleSelect(v)}
              options={defaultStyles.map((style) => ({
                label: (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{style.name}</span>
                      {defaultStyleIds.includes(style.id) && (
                        <Badge className="text-xs" variant="secondary">
                          内置
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {style.description}
                    </span>
                  </div>
                ),
                value: style.id,
              }))}
              placeholder="选择样式"
              value={styleConfig?.id}
            />
            {/* 样式操作按钮 */}
            <div className="flex gap-2">
              {!isBuiltIn && (
                <Button
                  disabled={!styleConfig || isBuiltIn}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        {isChange && (
          <Card>
            <CardContent className="pt-4">
              {isBuiltIn && (
                <div className="mb-4 space-y-2">
                  <Label className="font-medium text-sm">新样式名称</Label>
                  <Input
                    onChange={(e) => setNewStyleName(e.target.value)}
                    placeholder={`自定义 ${styleConfig.name}`}
                    value={newStyleName}
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
            <ConfigForm
              config={styleConfig.content}
              onConfigChange={handleContentChange}
            />
          </CardContent>
        </Card>

        {/* 封面设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">封面设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConfigForm
              config={mergeCoverConfig(styleConfig.content, styleConfig.cover)}
              onConfigChange={handleCoverChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Configurator.displayName = 'Configurator';
