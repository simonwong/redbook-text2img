interface JsonLdProps {
  data: object;
}

/** 输出一段 JSON-LD 结构化数据；转义 `<` 防止内容提前闭合 script 标签 */
export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be emitted as raw script content.
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
    type="application/ld+json"
  />
);
