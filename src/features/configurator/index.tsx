'use client';

import { Palette, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { Card } from '@/components/enhance/card';
import { Select } from '@/components/enhance/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { defaultStyleIds, defaultStyles } from '@/lib/default-styles';
import type { ContentConfig } from '@/lib/image-style-config';
import {
  BackgroundOptions,
  FontColorOptions,
  FontSizeOptions,
  HorizontalOptions,
  VerticalOptions,
} from '@/lib/preset-config';
import { mergeCoverConfig } from '@/lib/style-generator';
import { showSettingStore, useStyleConfigStore } from '@/store/styleConfig';
import { ColorSelect } from './ColorSelect';

const ConfigForm = ({
  config,
  onConfigChange,
}: {
  config: Partial<ContentConfig>;
  onConfigChange: (change: Partial<ContentConfig>) => void;
}) => (
  <>
    <div className="space-y-2">
      <Label className="font-medium text-sm">基准大小</Label>
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
        <ColorSelect
          onChange={(v) => onConfigChange({ titleColor: v })}
          options={FontColorOptions}
          value={config.titleColor}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-sm">内容颜色</Label>
        <ColorSelect
          onChange={(v) => onConfigChange({ contentColor: v })}
          options={FontColorOptions}
          value={config.contentColor}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label className="font-medium text-sm">背景颜色</Label>
      <ColorSelect
        onChange={(v) => onConfigChange({ background: v })}
        options={BackgroundOptions}
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
  const { styleConfig, setBuildInStyleConfig, setStyleConfig, isChange } =
    useStyleConfigStore();
  const isShowSetting = showSettingStore((state) => state.isShowSetting);
  const handleStyleSelect = (styleId: string) => {
    const selectedStyle = defaultStyles.find((style) => style.id === styleId);
    if (selectedStyle) {
      setBuildInStyleConfig(selectedStyle);
    }
  };
  const resetCurrentStyle = () => {
    const currentStyleId = styleConfig.id || defaultStyles[0].id;
    const selectedStyle = defaultStyles.find(
      (style) => style.id === currentStyleId
    );
    if (selectedStyle) {
      setBuildInStyleConfig(selectedStyle);
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
    <aside aria-label="样式配置" className="overflow-auto">
      <div className="space-y-4">
        <Card
          contentClassName="flex space-x-4"
          title={
            <>
              <Palette className="h-4 w-4" />
              样式选择
            </>
          }
        >
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
        </Card>
        <div className="flex gap-4">
          <Card contentClassName="space-y-4" title="内容设置">
            <ConfigForm
              config={styleConfig.content}
              onConfigChange={handleContentChange}
            />
          </Card>
          <Card contentClassName="space-y-4" title="封面设置">
            <ConfigForm
              config={mergeCoverConfig(styleConfig.content, styleConfig.cover)}
              onConfigChange={handleCoverChange}
            />
          </Card>
        </div>
        {isChange && (
          <Card>
            {/* {isBuiltIn && (
                <div className="mb-4 space-y-2">
                  <Label className="font-medium text-sm">新样式名称</Label>
                  <Input
                    onChange={(e) => setNewStyleName(e.target.value)}
                    placeholder={`自定义 ${styleConfig.name}`}
                    value={newStyleName}
                  />
                </div>
              )} */}
            <div className="flex gap-2">
              {/* <Button className="flex-1" onClick={saveEditing}>
                  <SaveIcon className="mr-1 h-3 w-3" />
                  {isBuiltIn ? '保存为新样式' : '保存更改'}
                </Button> */}
              <Button onClick={resetCurrentStyle} variant="outline">
                重置
              </Button>
            </div>
          </Card>
        )}
      </div>
    </aside>
  );
});

Configurator.displayName = 'Configurator';
