export interface ImageStyle {
  id: string;
  name: string;
  description: string;
  backgroundGradient: string;
  width: number;
  height: number;
}

// TODO: 样式应该在这里定义
export const imageStyles: ImageStyle[] = [
  {
    id: 'simple',
    name: '简约风格',
    description: '干净简洁的白色背景，适合日常分享',
    backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    width: 600,
    height: 800,
  },
  {
    id: 'gradient',
    name: '渐变风格',
    description: '温暖的渐变背景，更有视觉冲击力',
    backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f3e8ff 100%)',
    width: 600,
    height: 800,
  },
  {
    id: 'dark',
    name: '深色风格',
    description: '深色背景配亮色文字，时尚现代感',
    backgroundGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
    width: 600,
    height: 800,
  },
];

export function getStyleById(id: string): ImageStyle {
  return imageStyles.find(style => style.id === id) || imageStyles[0];
} 