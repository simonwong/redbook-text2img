import { fromMarkdown } from "mdast-util-from-markdown";
import { normalizeUri } from "micromark-util-sanitize-uri";
import { imageReference } from "../image-reference";

export function unusedImageIds(ids: string[], markdown: string): string[] {
  const used = new Set(imageReference.ids(markdown));
  return ids.filter((id) => !used.has(id));
}

const whitespace = /\s/;

function destinationStart(raw: string): number {
  let depth = 1;
  let index = 2;
  for (; index < raw.length && depth > 0; index += 1) {
    if (raw[index] === "\\") {
      index += 1;
    } else if (raw[index] === "[") {
      depth += 1;
    } else if (raw[index] === "]") {
      depth -= 1;
    }
  }
  index += 1;
  while (whitespace.test(raw[index] ?? "")) {
    index += 1;
  }
  return index;
}

function destinationEnd(raw: string, from: number, angle: boolean): number {
  let depth = 0;
  for (let index = from; index < raw.length; index += 1) {
    const char = raw[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (angle) {
      if (char === ">") {
        return index;
      }
      continue;
    }
    if (whitespace.test(char) || (char === ")" && depth === 0)) {
      return index;
    }
    if (char === "(") {
      depth += 1;
    }
    if (char === ")") {
      depth -= 1;
    }
  }
  return raw.length;
}

type ImageNode = Extract<
  ReturnType<typeof fromMarkdown>["children"][number],
  { type: "image" }
>;

function findImage(
  markdown: string,
  matches: (node: ImageNode) => boolean
): ImageNode | null {
  const tree = fromMarkdown(markdown);
  let found: ImageNode | null = null;
  function visit(node: typeof tree | (typeof tree.children)[number]): void {
    if (found) {
      return;
    }
    if (node.type === "image" && matches(node)) {
      found = node;
    }
    if ("children" in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }
  visit(tree);
  return found;
}

function locateRemoteImage(markdown: string, url: string) {
  const node = findImage(
    markdown,
    (image) => normalizeUri(image.url) === normalizeUri(url)
  );
  const start = node?.position?.start.offset;
  const end = node?.position?.end.offset;
  if (!node || start === undefined || end === undefined) {
    return null;
  }
  const raw = markdown.slice(start, end);
  let from = destinationStart(raw);
  const angle = raw[from] === "<";
  if (angle) {
    from += 1;
  }
  return {
    from: start + from,
    node,
    to: start + destinationEnd(raw, from, angle),
  };
}

export function findRemoteImage(
  markdown: string,
  url: string
): { from: number; to: number } | null {
  const match = locateRemoteImage(markdown, url);
  return match ? { from: match.from, to: match.to } : null;
}

export function replaceRemoteImage(
  markdown: string,
  url: string,
  source: string
): string {
  const match = locateRemoteImage(markdown, url);
  if (!match) {
    return markdown;
  }
  const rewritten =
    markdown.slice(0, match.from) + source + markdown.slice(match.to);
  const image = findImage(
    rewritten,
    (node) => node.position?.start.offset === match.node.position?.start.offset
  );
  return image?.url === source &&
    image.alt === match.node.alt &&
    image.title === match.node.title
    ? rewritten
    : markdown;
}
