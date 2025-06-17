import { EditorCard } from '@/features/editor';
import { PreviewCard } from '@/features/preview';
import { Configurator } from '@/features/configurator';

const MarkdownToImageApp = () => {
  return (
    <div className="max-w-7xl py-4 mx-auto h-full max-h-full">
      <div className="flex gap-6 px-4 h-full max-h-full">
        <EditorCard />
        <PreviewCard />
        <Configurator />
      </div>
    </div>
  );
};

export default MarkdownToImageApp;
