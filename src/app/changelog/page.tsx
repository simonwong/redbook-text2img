import React from 'react';
import ReactMarkdown from 'react-markdown';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ChangeLogPage = async () => {
  // 在服务器端读取 CHANGELOG.md 文件
  const changelogPath = join(process.cwd(), 'CHANGELOG.md');
  const changelogContent = await readFile(changelogPath, 'utf8');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="prose prose-lg prose-gray max-w-none dark:prose-invert">
        <ReactMarkdown>{changelogContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChangeLogPage;
