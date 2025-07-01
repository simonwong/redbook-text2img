import { Configurator } from '@/features/configurator';
import { EditorCard } from '@/features/editor';
import { PreviewCard } from '@/features/preview';

const MarkdownToImageApp = () => {
  return (
    <div className="mx-auto h-full max-h-full max-w-7xl py-4">
      <div className="flex h-full max-h-full gap-6 px-4">
        <EditorCard />
        <PreviewCard />
        <Configurator />
      </div>
    </div>
  );
};

export default MarkdownToImageApp;
