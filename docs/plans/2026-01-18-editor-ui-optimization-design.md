# 编辑器界面优化设计文档

**日期**: 2026-01-18
**设计者**: Claude Sonnet 4.5

## 概述

本设计文档详细描述编辑器界面的五项核心优化：优化三个渐变主题样式、统一输入框宽度、合并主题选择与风格调整、调整卡片尺寸为 375×500px、优化标题对齐配置逻辑。

## 目标

1. 提升「暖阳渐变」「冷调渐变」「小红书粉」三个主题的视觉精致度
2. 统一风格调整区域所有 Select 组件宽度为 100%
3. 简化配置面板布局，将主题选择与风格调整合并为单个卡片
4. 标准化卡片尺寸为 375×500px，配合 3 倍缩放输出 1125×1500px
5. 实现封面固定居中，内页可调整对齐方式的智能逻辑

---

## 一、三个渐变主题精致化优化

### 1.1 暖阳渐变 (gradient-warm)

**优化点**:
- **渐变色彩优化**: 从原有的 3 色停止点扩展为 4 色，增强过渡层次
  - 新渐变: `linear-gradient(135deg, #fff7ed 0%, #fef3c7 30%, #fed7aa 60%, #fbbf24 100%)`
  - 角度从 145deg 调整为 135deg，增强温暖感
- **文字对比度提升**:
  - 标题颜色: `#92400e` → `#78350f` (加深)
  - 正文颜色: `#78350f` → `#713f12` (加深)
  - 斜体颜色: `#a16207` 保持
- **引用框层次感增强**:
  - 背景透明度: `rgba(255, 255, 255, 0.6)` → `rgba(255, 255, 255, 0.7)`
  - 新增阴影: `box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1)`
- **高亮色调整**: `#f59e0b` → `#f97316` (更接近暖橙)
- **列表标记色**: `#f59e0b` → `#f97316` (与高亮色统一)

### 1.2 冷调渐变 (gradient-cool)

**优化点**:
- **渐变色彩优化**: 增强蓝调纯度和过渡
  - 新渐变: `linear-gradient(140deg, #f0f9ff 0%, #dbeafe 30%, #93c5fd 65%, #60a5fa 100%)`
  - 角度调整为 140deg
- **文字对比度调整**:
  - 标题颜色: `#075985` → `#0c4a6e` (加深)
  - 正文颜色: `#0c4a6e` → `#075985` (与标题拉开层次)
  - 斜体颜色: `#0369a1` 保持
- **引用框细节**:
  - 新增蓝色光晕: `box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08)`
- **代码块优化**:
  - inline 代码背景: `rgba(255, 255, 255, 0.7)` → `rgba(255, 255, 255, 0.8)`
  - 提升可读性

### 1.3 小红书粉 (xiaohongshu-pink)

**优化点**:
- **渐变色彩优化**: 增强粉色饱和度
  - 新渐变: `linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #f9a8d4 65%, #f472b6 100%)`
  - 角度调整为 135deg
- **文字对比度调整**:
  - 标题颜色: `#9d174d` → `#831843` (加深)
  - 正文颜色: `#831843` 保持
  - 强调色: `#be185d` 保持
- **引用框细节**:
  - 新增粉色光晕: `box-shadow: 0 2px 8px rgba(236, 72, 153, 0.12)`
- **列表标记色**: `#ec4899` → `#f472b6` (与渐变末端呼应)

---

## 二、密度系统配置更新

### 2.1 配置值标准化

基于提供的配置表，更新 `densityPresets` 为以下精确值：

#### Compact (紧凑型)
- **适用场景**: 清单/表格/代码/长文
- `padding`: 16px
- `baseFontSize`: 14px
- `lineHeight`: 1.5
- `paragraphGap`: 12px
- `headingGap`: 12px
- 标题字号: H1=20px, H2=16px (加粗)

#### Normal (标准型) - **新默认**
- **适用场景**: 通用文章/笔记/资讯
- `padding`: 24px
- `baseFontSize`: 16px
- `lineHeight`: 1.65
- `paragraphGap`: 20px
- `headingGap`: 16px
- 标题字号: H1=26px, H2=20px

#### Spacious (展示型)
- **适用场景**: 金句/封面/散文/海报
- `padding`: 32px
- `baseFontSize`: 19px
- `lineHeight`: 1.8
- `paragraphGap`: 32px
- `headingGap`: 24px
- 标题字号: H1=32px, H2=24px

### 2.2 实现说明

- 枚举值保持不变: `'compact'`, `'normal'`, `'spacious'`
- 仅更新 `densityPresets` 中的具体配置值
- UI 选项标签保持: `紧凑`, `正常`, `宽松`
- 默认值保持 `'normal'` (向后兼容)

---

## 三、UI 组件重构

### 3.1 Configurator 组件合并

**文件**: `src/features/configurator/index.tsx`

**改动**:
1. **删除**: "风格调整" 独立 Card
2. **重命名**: "主题选择" → "设置样式"
3. **布局**: 单个 Card，垂直堆叠所有配置项

**新结构**:
```tsx
<Card title="设置样式">
  <div className="space-y-4">
    {/* 主题选择 */}
    <div className="space-y-2">
      <Label>主题</Label>
      <Select className="w-full" {...} />
    </div>

    {/* 密度 */}
    <DimensionSelect label="密度" className="w-full" {...} />

    {/* 字体 */}
    <DimensionSelect label="字体" className="w-full" {...} />

    {/* 标题对齐 */}
    <DimensionSelect label="标题对齐" className="w-full" {...} />
  </div>

  {/* 重置按钮 */}
  {isModified && <Button>重置风格调整</Button>}
</Card>
```

### 3.2 Select 组件宽度统一

- 所有 `<Select>` 组件添加 `className="w-full"`
- 移除主题选择器的独立宽度限制
- 确保所有输入框宽度 100%

---

## 四、卡片尺寸标准化

### 4.1 尺寸规格

- **目标尺寸**: 375px × 500px
- **输出尺寸**: 1125px × 1500px (scale: 3)
- **宽高比**: 3:4 (小红书标准)

### 4.2 实现位置

**文件**: `src/lib/theme/style-generator.ts` (或类似样式生成文件)

**容器样式**:
```ts
container: {
  width: '375px',
  height: '500px',
  boxSizing: 'border-box',
  // ...其他样式
}
```

### 4.3 注意事项

- `html2canvas` 已配置 `scale: 3`，无需额外处理
- 确保 `box-sizing: border-box` 防止 padding 撑大容器
- 移除任何 `min-width`/`max-width` 限制

---

## 五、标题对齐逻辑优化

### 5.1 封面检测规则

**封面定义**: 包含 `# 一级标题` 的内容段落视为封面

**检测逻辑**:
```ts
// 在 markdown-parser 中
const isCover = /^#\s+/m.test(segment.content);
```

### 5.2 数据结构更新

**ImageSegment 类型扩展**:
```ts
interface ImageSegment {
  content: string;
  isFirstImage: boolean;
  isCover: boolean; // 新增字段
}
```

### 5.3 样式应用逻辑

**文件**: `src/features/preview/image-preview.tsx`

```ts
const coverStyle = segment.isCover
  ? theme.coverStyle  // 封面: 强制使用主题默认 (垂直水平居中)
  : undefined;        // 非封面: 应用用户的 headingAlignment 调整
```

### 5.4 行为说明

- **封面图**: 忽略用户的"标题对齐"设置，始终使用 `defaultCoverStyle` (垂直水平居中)
- **内页图**: 遵循用户的"标题对齐"设置 (居中/左对齐)
- **兼容性**: 保持 `isFirstImage` 字段用于 HeaderBar 显示逻辑

---

## 六、实现清单

### 6.1 主题优化
- [ ] 更新 `src/lib/theme/themes.ts` 中三个渐变主题的配置
- [ ] 调整渐变色彩、角度、停止点
- [ ] 优化文字颜色对比度
- [ ] 为引用框添加 box-shadow
- [ ] 同步更新相关的 markerColor 和 highlight 颜色

### 6.2 密度配置
- [ ] 更新 `src/lib/theme/tokens.ts` 基础 spacing 和 typography 值
- [ ] 更新 `src/lib/theme/adjustments.ts` 中 `densityPresets` 配置
- [ ] 添加各密度档位的使用场景注释

### 6.3 UI 重构
- [ ] 重构 `src/features/configurator/index.tsx`
- [ ] 合并卡片，删除"风格调整"独立 Card
- [ ] 修改标题为"设置样式"
- [ ] 统一所有 Select 组件宽度为 100%
- [ ] 删除 Palette 图标

### 6.4 尺寸调整
- [ ] 在样式生成函数中设置容器尺寸为 375×500px
- [ ] 确保 box-sizing 正确
- [ ] 测试 html2canvas 输出为 1125×1500px

### 6.5 封面检测
- [ ] 在 `src/lib/markdown-parser` 中添加封面检测逻辑
- [ ] 扩展 `ImageSegment` 类型，添加 `isCover` 字段
- [ ] 更新 `src/features/preview/image-preview.tsx` 样式应用逻辑
- [ ] 测试封面和内页的对齐行为

---

## 七、测试计划

### 7.1 主题视觉测试
- 切换三个优化后的渐变主题，验证色彩过渡、对比度、阴影效果
- 测试长文本、引用框、代码块的显示效果

### 7.2 密度配置测试
- 切换三档密度，验证字号、行高、间距是否符合配置表
- 测试不同密度下的内容排版

### 7.3 布局测试
- 验证设置面板所有输入框宽度为 100%
- 测试不同屏幕宽度下的响应式表现

### 7.4 封面对齐测试
- 创建包含 `# 一级标题` 的封面内容，验证始终居中
- 创建无 `#` 的普通内容，验证对齐设置生效
- 测试多图输出，确保封面与内页行为正确

### 7.5 尺寸输出测试
- 使用 html2canvas 导出图片，验证尺寸为 1125×1500px
- 测试不同主题和密度下的导出效果

---

## 八、风险与注意事项

### 8.1 向后兼容性
- 密度枚举值保持不变，localStorage 数据无需迁移
- 默认主题和密度保持不变，现有用户体验不受影响

### 8.2 视觉一致性
- 三个渐变主题的优化需保持整体设计语言一致
- 确保优化后的对比度符合 WCAG 可访问性标准

### 8.3 性能考虑
- 封面检测的正则匹配性能开销极小
- 样式生成函数无额外性能影响

### 8.4 边界情况
- 处理 Markdown 中包含代码块内 `#` 符号的情况 (使用 `/^#\s+/m` 匹配行首)
- 确保空内容段落不会误判为封面

---

## 九、后续优化建议

1. **主题系统扩展**: 未来可考虑增加更多渐变主题变体
2. **自定义密度**: 允许用户自定义 padding、字号等细节参数
3. **封面模板**: 提供预设的封面布局模板供用户选择
4. **导出格式**: 支持更多输出尺寸 (如 1:1、16:9)

---

**设计审核状态**: ✅ 已通过
**可以开始实现**: 是
