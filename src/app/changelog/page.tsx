import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import ReactMarkdown from 'react-markdown';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata = generatePageMetadata(
  '更新日志',
  '查看小红书图片生成器的功能更新和版本变更记录',
  '/changelog'
);

const ChangeLogPage = async () => {
  // 在服务器端读取 CHANGELOG.md 文件
  const changelogPath = join(process.cwd(), 'CHANGELOG.md');
  const changelogContent = await readFile(changelogPath, 'utf8');

  return (
    <>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown components={{}}>{changelogContent}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default ChangeLogPage;
