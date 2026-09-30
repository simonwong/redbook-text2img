import { JsonLd } from "@/components/json-ld";
import { SEOOptimizedText } from "@/components/seo-optimized-text";
import { Layout } from "@/features/layouts";
import { webAppStructuredData, webSiteStructuredData } from "@/lib/seo-config";

const MarkdownToImageApp = () => (
  <>
    <JsonLd data={webSiteStructuredData} />
    <JsonLd data={webAppStructuredData} />
    <SEOOptimizedText />
    <div className="h-full max-h-full">
      <Layout />
    </div>
  </>
);

export default MarkdownToImageApp;
