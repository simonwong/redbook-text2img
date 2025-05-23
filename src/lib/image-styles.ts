export interface ImageStyle {
  id: string;
  name: string;
  description: string;
  containerClass: string;
  titleClass: string;
  contentClass: string;
  backgroundGradient: string;
  width: number;
  height: number;
}

export const imageStyles: ImageStyle[] = [
  {
    id: 'simple',
    name: '简约风格',
    description: '干净简洁的白色背景，适合日常分享',
    containerClass: 'bg-white p-8 rounded-lg shadow-sm border border-gray-100',
    titleClass: 'text-2xl font-bold text-gray-900 mb-6 leading-tight',
    contentClass: 'text-gray-700 leading-relaxed prose prose-gray max-w-none',
    backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    width: 600,
    height: 800,
  },
  {
    id: 'gradient',
    name: '渐变风格',
    description: '温暖的渐变背景，更有视觉冲击力',
    containerClass: 'bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8 rounded-xl shadow-lg',
    titleClass: 'text-2xl font-bold text-gray-900 mb-6 leading-tight',
    contentClass: 'text-gray-800 leading-relaxed prose prose-gray max-w-none',
    backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f3e8ff 100%)',
    width: 600,
    height: 800,
  },
  {
    id: 'dark',
    name: '深色风格',
    description: '深色背景配亮色文字，时尚现代感',
    containerClass: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl',
    titleClass: 'text-2xl font-bold text-white mb-6 leading-tight',
    contentClass: 'text-gray-200 leading-relaxed prose prose-invert max-w-none',
    backgroundGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
    width: 600,
    height: 800,
  },
];

export function getStyleById(id: string): ImageStyle {
  return imageStyles.find(style => style.id === id) || imageStyles[0];
} 