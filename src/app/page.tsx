import { HomeGuideDialog } from "@/components/home-guide-dialog";
import { HOME_INTRO_TITLE_ID, HomeIntro } from "@/components/home-intro";
import { JsonLd } from "@/components/json-ld";
import { Layout } from "@/features/layouts";
import { webAppStructuredData, webSiteStructuredData } from "@/lib/seo-config";

const MarkdownToImageApp = () => (
  <>
    <JsonLd data={webSiteStructuredData} />
    <JsonLd data={webAppStructuredData} />
    <div className="h-full max-h-full">
      <Layout />
    </div>
    <HomeGuideDialog labelledBy={HOME_INTRO_TITLE_ID}>
      <HomeIntro />
    </HomeGuideDialog>
  </>
);

export default MarkdownToImageApp;
