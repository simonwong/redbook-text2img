import { SEOOptimizedText } from "@/components/seo-optimized-text";
import { Layout } from "@/features/layouts";

const MarkdownToImageApp = () => (
  <>
    <SEOOptimizedText />
    <div className="h-full max-h-full">
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

export default MarkdownToImageApp;
