import { SEOOptimizedText } from '@/components/seo-optimized-text';
import { Configurator } from '@/features/configurator';
import { EditorCard } from '@/features/editor';
import { PreviewCard } from '@/features/preview';

const MarkdownToImageApp = () => {
  return (
    <>
      <SEOOptimizedText />
      <div className="mx-auto h-full max-h-full max-w-7xl py-4">
        <div
          aria-label="Markdown 图片生成器"
          className="flex h-full max-h-full gap-6 px-4"
          role="application"
        >
          <section aria-label="Markdown 编辑器">
            <EditorCard />
          </section>
          <section aria-label="图片预览">
            <PreviewCard />
          </section>
          <aside aria-label="样式配置">
            <Configurator />
          </aside>
        </div>
      </div>
    </>
  );
};

export default MarkdownToImageApp;
