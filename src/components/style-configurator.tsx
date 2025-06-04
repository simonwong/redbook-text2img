'use client';

import { useState, useEffect } from 'react';
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
import {
  StyleConfig,
  ContentConfig,
  SizeOption,
  ColorOption,
  PositionConfig,
} from '@/lib/image-style-config';
import { StyleManager } from '@/lib/style-manager';
import { presetConfig } from '@/lib/preset-config';
import { Palette, Settings, Copy, Trash2, Eye, Save } from 'lucide-react';

interface StyleConfiguratorProps {
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  onStyleUpdate?: () => void; // 样式更新时的回调
}

export function StyleConfigurator({
  selectedStyleId,
  onStyleChange,
  onStyleUpdate,
}: StyleConfiguratorProps) {
  const [allStyles, setAllStyles] = useState<StyleConfig[]>([]);
  const [currentConfig, setCurrentConfig] = useState<StyleConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<StyleConfig | null>(null);
  const [newStyleName, setNewStyleName] = useState('');

  // 加载所有样式
  useEffect(() => {
    loadAllStyles();
  }, []);

  // 当选择的样式改变时，更新当前配置
  useEffect(() => {
    const style = StyleManager.getStyleById(selectedStyleId);
    setCurrentConfig(style || null);
    setIsEditing(false);
  }, [selectedStyleId]);

  const loadAllStyles = () => {
    const styles = StyleManager.getAllStyles();
    setAllStyles(styles);
  };

  const handleStyleSelect = (styleId: string) => {
    onStyleChange(styleId);
    StyleManager.setCurrentStyle(styleId);
  };

  const startEditing = () => {
    if (currentConfig) {
      setEditingConfig(JSON.parse(JSON.stringify(currentConfig)));
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingConfig(null);
  };

  const saveEditing = () => {
    if (!editingConfig) return;

    // 如果是内置样式，需要创建副本
    if (['minimal', 'warm', 'tech'].includes(editingConfig.id)) {
      const newId = `custom-${Date.now()}`;
      const newConfig = {
        ...editingConfig,
        id: newId,
        name: newStyleName || `自定义 ${editingConfig.name}`,
        description: `基于 "${editingConfig.name}" 创建的自定义样式`,
      };

      if (StyleManager.saveCustomStyle(newConfig)) {
        handleStyleSelect(newId);
        setNewStyleName('');
      }
    } else {
      // 更新现有自定义样式
      if (StyleManager.saveCustomStyle(editingConfig)) {
        setCurrentConfig(editingConfig);
      }
    }

    setIsEditing(false);
    setEditingConfig(null);
    loadAllStyles();
    onStyleUpdate?.();
  };

  const duplicateStyle = () => {
    if (!currentConfig) return;

    const newId = `custom-${Date.now()}`;
    const clonedStyle = StyleManager.cloneStyle(
      currentConfig.id,
      newId,
      `复制的 ${currentConfig.name}`
    );

    if (clonedStyle && StyleManager.saveCustomStyle(clonedStyle)) {
      handleStyleSelect(newId);
      loadAllStyles();
      onStyleUpdate?.();
    }
  };

  const deleteStyle = () => {
    if (!currentConfig || ['minimal', 'warm', 'tech'].includes(currentConfig.id)) {
      return; // 不能删除内置样式
    }

    if (StyleManager.deleteCustomStyle(currentConfig.id)) {
      handleStyleSelect('minimal'); // 切换到默认样式
      loadAllStyles();
      onStyleUpdate?.();
    }
  };

  const updateContentConfig = (updates: Partial<ContentConfig>) => {
    if (!editingConfig) return;

    setEditingConfig({
      ...editingConfig,
      content: { ...editingConfig.content, ...updates },
    });
  };

  const updateCoverConfig = (updates: Partial<ContentConfig>) => {
    if (!editingConfig) return;

    setEditingConfig({
      ...editingConfig,
      cover: { ...editingConfig.cover, ...updates },
    });
  };

  const updatePosition = (type: 'content' | 'cover', position: Partial<PositionConfig>) => {
    if (!editingConfig) return;

    if (type === 'content') {
      updateContentConfig({
        position: { ...editingConfig.content.position, ...position },
      });
    } else {
      updateCoverConfig({
        position: {
          ...(editingConfig.cover?.position || { vertical: 'center', horizontal: 'center' }),
          ...position,
        },
      });
    }
  };

  const config = isEditing ? editingConfig : currentConfig;
  const isBuiltIn = config ? ['minimal', 'warm', 'tech'].includes(config.id) : false;

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
          <Select value={selectedStyleId} onValueChange={handleStyleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="选择样式" />
            </SelectTrigger>
            <SelectContent>
              {allStyles.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{style.name}</span>
                      {['minimal', 'warm', 'tech'].includes(style.id) && (
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
            <Button
              variant="outline"
              size="sm"
              onClick={isEditing ? cancelEditing : startEditing}
              className="flex-1"
            >
              <Settings className="w-3 h-3 mr-1" />
              {isEditing ? '取消' : '编辑'}
            </Button>

            <Button variant="outline" size="sm" onClick={duplicateStyle} disabled={!currentConfig}>
              <Copy className="w-3 h-3" />
            </Button>

            {!isBuiltIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={deleteStyle}
                disabled={!currentConfig || isBuiltIn}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 配置编辑器 */}
      {isEditing && config && (
        <>
          {/* 保存按钮 */}
          <Card>
            <CardContent className="pt-4">
              {isBuiltIn && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">新样式名称</label>
                  <Input
                    value={newStyleName}
                    onChange={(e) => setNewStyleName(e.target.value)}
                    placeholder={`自定义 ${config.name}`}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={saveEditing} className="flex-1">
                  <Save className="w-3 h-3 mr-1" />
                  {isBuiltIn ? '保存为新样式' : '保存更改'}
                </Button>
                <Button variant="outline" onClick={cancelEditing}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 内容设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">内容设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 大小设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">大小</label>
                <div className="flex gap-2">
                  <Select
                    value={config.content.size}
                    onValueChange={(value: SizeOption) => updateContentConfig({ size: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">小 (12px)</SelectItem>
                      <SelectItem value="md">中 (14px)</SelectItem>
                      <SelectItem value="lg">大 (16px)</SelectItem>
                      <SelectItem value="xl">特大 (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="自定义大小"
                    value={config.content.customFontSize || ''}
                    onChange={(e) =>
                      updateContentConfig({
                        customFontSize: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-24"
                  />
                </div>
              </div>

              {/* 颜色设置 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">标题颜色</label>
                  <Select
                    value={config.content.titleColor}
                    onValueChange={(value: ColorOption) =>
                      updateContentConfig({ titleColor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">白色</SelectItem>
                      <SelectItem value="black">黑色</SelectItem>
                      <SelectItem value="gray">灰色</SelectItem>
                      <SelectItem value="blue">蓝色</SelectItem>
                      <SelectItem value="red">红色</SelectItem>
                      <SelectItem value="green">绿色</SelectItem>
                      <SelectItem value="purple">紫色</SelectItem>
                      <SelectItem value="orange">橙色</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.content.titleColor === 'custom' && (
                    <Input
                      type="color"
                      value={config.content.titleCustomColor || '#000000'}
                      onChange={(e) => updateContentConfig({ titleCustomColor: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">内容颜色</label>
                  <Select
                    value={config.content.contentColor}
                    onValueChange={(value: ColorOption) =>
                      updateContentConfig({ contentColor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">白色</SelectItem>
                      <SelectItem value="black">黑色</SelectItem>
                      <SelectItem value="gray">灰色</SelectItem>
                      <SelectItem value="blue">蓝色</SelectItem>
                      <SelectItem value="red">红色</SelectItem>
                      <SelectItem value="green">绿色</SelectItem>
                      <SelectItem value="purple">紫色</SelectItem>
                      <SelectItem value="orange">橙色</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.content.contentColor === 'custom' && (
                    <Input
                      type="color"
                      value={config.content.contentCustomColor || '#000000'}
                      onChange={(e) => updateContentConfig({ contentCustomColor: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {/* 背景设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">背景</label>
                <Select
                  value={config.content.background}
                  onValueChange={(value) => updateContentConfig({ background: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择背景" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetConfig.backgrounds.map((bg, index) => (
                      <SelectItem key={index} value={bg}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border" style={{ background: bg }} />
                          <span className="text-xs">
                            {bg.startsWith('#')
                              ? '纯色'
                              : bg.startsWith('linear')
                                ? '渐变'
                                : '图片'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="或输入自定义背景 (CSS 格式)"
                  value={config.content.background}
                  onChange={(e) => updateContentConfig({ background: e.target.value })}
                  className="text-xs"
                />
              </div>

              {/* 位置设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">位置</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={config.content.position.vertical}
                    onValueChange={(value: 'top' | 'center' | 'bottom') =>
                      updatePosition('content', { vertical: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">居上</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="bottom">居下</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={config.content.position.horizontal}
                    onValueChange={(value: 'left' | 'center' | 'right') =>
                      updatePosition('content', { horizontal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">居左</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="right">居右</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 封面设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">封面设置</CardTitle>
              <p className="text-xs text-gray-500">
                封面设置会覆盖内容设置，未设置的项目将继承内容设置
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 封面大小设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">大小 (默认比内容大一号)</label>
                <div className="flex gap-2">
                  <Select
                    value={config.cover?.size || 'inherit'}
                    onValueChange={(value: SizeOption | 'inherit') =>
                      updateCoverConfig({ size: value === 'inherit' ? undefined : value })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="继承内容设置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">继承内容设置</SelectItem>
                      <SelectItem value="sm">小 (12px)</SelectItem>
                      <SelectItem value="md">中 (14px)</SelectItem>
                      <SelectItem value="lg">大 (16px)</SelectItem>
                      <SelectItem value="xl">特大 (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="自定义大小"
                    value={config.cover?.customFontSize || ''}
                    onChange={(e) =>
                      updateCoverConfig({
                        customFontSize: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-24"
                  />
                </div>
              </div>

              {/* 封面颜色设置 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">标题颜色</label>
                  <Select
                    value={config.cover?.titleColor || 'inherit'}
                    onValueChange={(value: ColorOption | 'inherit') =>
                      updateCoverConfig({ titleColor: value === 'inherit' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="继承内容设置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">继承内容设置</SelectItem>
                      <SelectItem value="white">白色</SelectItem>
                      <SelectItem value="black">黑色</SelectItem>
                      <SelectItem value="gray">灰色</SelectItem>
                      <SelectItem value="blue">蓝色</SelectItem>
                      <SelectItem value="red">红色</SelectItem>
                      <SelectItem value="green">绿色</SelectItem>
                      <SelectItem value="purple">紫色</SelectItem>
                      <SelectItem value="orange">橙色</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.cover?.titleColor === 'custom' && (
                    <Input
                      type="color"
                      value={config.cover?.titleCustomColor || '#000000'}
                      onChange={(e) => updateCoverConfig({ titleCustomColor: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">内容颜色</label>
                  <Select
                    value={config.cover?.contentColor || 'inherit'}
                    onValueChange={(value: ColorOption | 'inherit') =>
                      updateCoverConfig({ contentColor: value === 'inherit' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="继承内容设置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">继承内容设置</SelectItem>
                      <SelectItem value="white">白色</SelectItem>
                      <SelectItem value="black">黑色</SelectItem>
                      <SelectItem value="gray">灰色</SelectItem>
                      <SelectItem value="blue">蓝色</SelectItem>
                      <SelectItem value="red">红色</SelectItem>
                      <SelectItem value="green">绿色</SelectItem>
                      <SelectItem value="purple">紫色</SelectItem>
                      <SelectItem value="orange">橙色</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.cover?.contentColor === 'custom' && (
                    <Input
                      type="color"
                      value={config.cover?.contentCustomColor || '#000000'}
                      onChange={(e) => updateCoverConfig({ contentCustomColor: e.target.value })}
                    />
                  )}
                </div>
              </div>

              {/* 封面背景设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">背景</label>
                <Select
                  value={config.cover?.background || 'inherit'}
                  onValueChange={(value) =>
                    updateCoverConfig({ background: value === 'inherit' ? undefined : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="继承内容设置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">继承内容设置</SelectItem>
                    {presetConfig.backgrounds.map((bg, index) => (
                      <SelectItem key={index} value={bg}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border" style={{ background: bg }} />
                          <span className="text-xs">
                            {bg.startsWith('#')
                              ? '纯色'
                              : bg.startsWith('linear')
                                ? '渐变'
                                : '图片'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="或输入自定义背景 (CSS 格式)"
                  value={config.cover?.background || ''}
                  onChange={(e) => updateCoverConfig({ background: e.target.value || undefined })}
                  className="text-xs"
                />
              </div>

              {/* 封面位置设置 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">位置 (默认居中)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={config.cover?.position?.vertical || 'center'}
                    onValueChange={(value: 'top' | 'center' | 'bottom') =>
                      updatePosition('cover', { vertical: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">居上</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="bottom">居下</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={config.cover?.position?.horizontal || 'center'}
                    onValueChange={(value: 'left' | 'center' | 'right') =>
                      updatePosition('cover', { horizontal: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">居左</SelectItem>
                      <SelectItem value="center">居中</SelectItem>
                      <SelectItem value="right">居右</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* 样式预览 */}
      {config && !isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              当前样式
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-6 rounded border"
                  style={{ background: config.content.background }}
                />
                <div>
                  <div className="font-medium text-sm">{config.name}</div>
                  <div className="text-xs text-gray-500">{config.description}</div>
                </div>
              </div>

              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                大小: {config.content.size.toUpperCase()} | 标题: {config.content.titleColor} |
                内容: {config.content.contentColor} | 位置: {config.content.position.vertical}-
                {config.content.position.horizontal}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
