import { fromMarkdown } from "mdast-util-from-markdown";

export interface ContentImageReference {
  align: "left" | "center" | "right";
  id: string;
  size: "s" | "m" | "l" | "full";
}

const referencePattern = /^image:([a-zA-Z0-9_-]+)(?:\?([^#]*))?$/;

function parse(source: string): ContentImageReference | null {
  const match = referencePattern.exec(source);
  if (!match) {
    return null;
  }
  const params = new URLSearchParams(match[2]);
  const align = params.get("align");
  const size = params.get("size");
  return {
    align: align === "left" || align === "right" ? align : "center",
    id: match[1],
    size: size === "s" || size === "m" || size === "l" ? size : "full",
  };
}

function imageSources(markdown: string): string[] {
  const tree = fromMarkdown(markdown);
  const definitions = new Map<string, string>();
  const images: string[] = [];
  const references: string[] = [];
  function visit(node: typeof tree | (typeof tree.children)[number]): void {
    if (node.type === "definition" && !definitions.has(node.identifier)) {
      definitions.set(node.identifier, node.url);
    }
    if (node.type === "image") {
      images.push(node.url);
    }
    if (node.type === "imageReference") {
      references.push(node.identifier);
    }
    if ("children" in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }
  visit(tree);
  return [...images, ...references.flatMap((id) => definitions.get(id) ?? [])];
}

export const imageReference = {
  format(reference: ContentImageReference): string {
    const source = `image:${reference.id}?align=${reference.align}&size=${reference.size}`;
    const normalized = parse(source);
    if (!normalized) {
      throw new Error("无效的图片资产标识");
    }
    const params = new URLSearchParams();
    if (normalized.align !== "center") {
      params.set("align", normalized.align);
    }
    if (normalized.size !== "full") {
      params.set("size", normalized.size);
    }
    const query = params.toString();
    return `image:${normalized.id}${query ? `?${query}` : ""}`;
  },
  hasImages(markdown: string): boolean {
    return imageSources(markdown).length > 0;
  },
  ids(markdown: string): string[] {
    return [
      ...new Set(
        imageSources(markdown).flatMap((source) => {
          const reference = parse(source);
          return reference ? [reference.id] : [];
        })
      ),
    ];
  },
  parse,
  single(markdown: string) {
    const tree = fromMarkdown(markdown);
    const [paragraph] = tree.children;
    if (
      tree.children.length !== 1 ||
      paragraph?.type !== "paragraph" ||
      paragraph.children.length !== 1
    ) {
      return null;
    }
    const [image] = paragraph.children;
    if (image.type !== "image") {
      return null;
    }
    const reference = parse(image.url);
    return reference
      ? { alt: image.alt ?? "", reference, source: image.url }
      : null;
  },
};
