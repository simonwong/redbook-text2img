import { SEOOptimizedText } from "@/components/seo-optimized-text";
import { Layout } from "@/features/layouts";

const MarkdownToImageApp = () => {
  return (
    <>
      <SEOOptimizedText />
      <div className="mx-auto h-full max-h-full max-w-7xl py-4">
        <div
          aria-label="Markdown 图片生成器"
          className="h-full max-h-full"
          role="application"
        >
          <Layout />
        </div>
      </div>
    </>
  );
};

export default MarkdownToImageApp;
