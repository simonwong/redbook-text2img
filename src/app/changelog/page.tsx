import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ReactMarkdown from "react-markdown";
import { JsonLd } from "@/components/json-ld";
import {
  generateBreadcrumbStructuredData,
  generatePageMetadata,
} from "@/lib/seo-config";

export const metadata = generatePageMetadata(
  "更新日志",
  "小红书图片生成器各版本的更新记录：新增主题、样式配置、内容图片与导出方面的改动。",
  "/changelog"
);

const ChangeLogPage = async () => {
  // 在服务器端读取 CHANGELOG.md 文件
  const changelogPath = join(process.cwd(), "CHANGELOG.md");
  const changelogContent = await readFile(changelogPath, "utf8");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={generateBreadcrumbStructuredData("更新日志", "/changelog")}
      />
      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        <h1>更新日志</h1>
        <ReactMarkdown>{changelogContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChangeLogPage;
