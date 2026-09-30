import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ReactMarkdown from "react-markdown";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
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
    <PageShell
      description="小红书图片生成器各版本的功能更新与修复记录。"
      title="更新日志"
    >
      <JsonLd
        data={generateBreadcrumbStructuredData("更新日志", "/changelog")}
      />
      <div className="ds-panel px-5 py-5 sm:px-7">
        <div className="ds-prose prose max-w-none">
          <ReactMarkdown>{changelogContent}</ReactMarkdown>
        </div>
      </div>
    </PageShell>
  );
};

export default ChangeLogPage;
