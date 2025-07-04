import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: '小红书图片生成器',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000',
    orientation: 'portrait',
    scope: '/',
    lang: 'zh-CN',
    categories: ['productivity', 'utilities', 'graphics'],
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-1.png',
        sizes: '2806x1696',
        type: 'image/png',
        form_factor: 'wide',
        label: '小红书图片生成器界面截图',
      },
    ],
  };
}
