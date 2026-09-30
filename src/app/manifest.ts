import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    categories: ["productivity", "utilities", "graphics"],
    description: siteConfig.description,
    display: "standalone",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
    ],
    lang: "zh-CN",
    name: siteConfig.name,
    orientation: "portrait",
    scope: "/",
    screenshots: [
      {
        form_factor: "wide",
        label: "小红书图片生成器界面截图",
        sizes: "2540x1608",
        src: "/screenshot-1.png",
        type: "image/png",
      },
    ],
    short_name: "小红书图片生成器",
    start_url: "/",
    theme_color: "#ebebee",
  };
}
