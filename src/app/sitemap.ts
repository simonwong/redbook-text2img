import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: siteConfig.url,
    },
    {
      changeFrequency: "monthly",
      priority: 0.9,
      url: `${siteConfig.url}/faq`,
    },
    {
      changeFrequency: "monthly",
      priority: 0.8,
      url: `${siteConfig.url}/changelog`,
    },
  ];
}
