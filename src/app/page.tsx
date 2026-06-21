import { SEOOptimizedText } from "@/components/seo-optimized-text";
import { Layout } from "@/features/layouts";

const MarkdownToImageApp = () => (
  <>
    <SEOOptimizedText />
    <div className="h-full max-h-full">
      <Layout />
    </div>
  </>
);

export default MarkdownToImageApp;
