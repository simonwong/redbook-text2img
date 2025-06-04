import { StyleConfig } from './image-style-config';
import { generateStylesFromConfig } from './style-generator';
import {
  presetConfig,
  getTypographyScale,
  getLineHeight,
  calculateFontSize,
} from './preset-config';

// 测试配置
const testConfig: StyleConfig = {
  id: 'test-typography',
  name: '测试 Typography 系统',
  description: '验证基于 Tailwind 的字体比例系统',
  content: {
    size: 'lg',
    titleColor: 'black',
    contentColor: 'gray',
    background:
      'linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)',
    position: {
      vertical: 'center',
      horizontal: 'left',
    },
  },
  cover: {
    position: {
      vertical: 'center',
      horizontal: 'center',
    },
  },
};

// 测试函数
function testTypographySystem() {
  console.log('=== 测试 Tailwind Typography 系统 ===\n');

  // 1. 测试基础配置
  console.log('1. 基础字体大小配置:');
  Object.entries(presetConfig.sizes).forEach(([size, value]) => {
    console.log(`  ${size}: ${value}rem (${value * 16}px)`);
  });

  console.log('\n2. Typography 比例系统:');
  Object.entries(presetConfig.typography.scales).forEach(([element, scale]) => {
    const lineHeight =
      presetConfig.typography.lineHeights[
        element as keyof typeof presetConfig.typography.lineHeights
      ];
    console.log(`  ${element}: ${scale}x (行高: ${lineHeight})`);
  });

  // 2. 测试实际字体大小计算
  console.log('\n3. 基于 lg 基础大小 (1rem) 的实际字体大小:');
  const baseFontSize = presetConfig.sizes.lg; // 1rem

  Object.entries(presetConfig.typography.scales).forEach(([element, scale]) => {
    const actualSize = calculateFontSize(baseFontSize, scale);
    const lineHeight = getLineHeight(element as keyof typeof presetConfig.typography.lineHeights);
    console.log(`  ${element}: ${actualSize}rem (${actualSize * 16}px), 行高: ${lineHeight}`);
  });

  // 3. 测试样式生成
  console.log('\n4. 测试样式生成:');
  const { contentStyles, coverStyles } = generateStylesFromConfig(testConfig);

  console.log('  内容样式:');
  console.log(`    容器字体大小: ${contentStyles.container.fontSize}`);
  console.log(
    `    H1 字体大小: ${contentStyles.h1.fontSize}, 行高: ${contentStyles.h1.lineHeight}`
  );
  console.log(
    `    H2 字体大小: ${contentStyles.h2.fontSize}, 行高: ${contentStyles.h2.lineHeight}`
  );
  console.log(`    正文字体大小: ${contentStyles.p.fontSize}, 行高: ${contentStyles.p.lineHeight}`);

  console.log('\n  封面样式:');
  console.log(`    容器字体大小: ${coverStyles.container.fontSize}`);
  console.log(`    H1 字体大小: ${coverStyles.h1.fontSize}, 行高: ${coverStyles.h1.lineHeight}`);

  // 4. 验证响应式缩放
  console.log('\n5. 不同基础大小的响应式测试:');
  ['sm', 'md', 'lg', 'xl'].forEach((size) => {
    const baseSize = presetConfig.sizes[size as keyof typeof presetConfig.sizes];
    const h1Size = calculateFontSize(baseSize, getTypographyScale('h1'));
    const bodySize = calculateFontSize(baseSize, getTypographyScale('body'));

    console.log(`  ${size} (${baseSize}rem): H1=${h1Size}rem, Body=${bodySize}rem`);
  });

  console.log('\n=== 测试完成 ===');
}

// 运行测试
testTypographySystem();

export { testTypographySystem };
