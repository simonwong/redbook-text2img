import { fromMarkdown } from "mdast-util-from-markdown";
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

export function replaceRemoteImage(
  markdown: string,
  url: string,
  source: string
): string {
  const tree = fromMarkdown(markdown);
  let range: { from: number; to: number } | undefined;
  function visit(node: typeof tree | (typeof tree.children)[number]): void {
    if (range) {
      return;
    }
    if (node.type === "image" && node.url === url && node.position) {
      const start = node.position.start.offset;
      const end = node.position.end.offset;
      if (start === undefined || end === undefined) {
        return;
      }
      const raw = markdown.slice(start, end);
      let from = destinationStart(raw);
      const angle = raw[from] === "<";
      if (angle) {
        from += 1;
      }
      const index = destinationEnd(raw, from, angle);
      range = { from: start + from, to: start + index };
    }
    if ("children" in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }
  visit(tree);
  return range
    ? markdown.slice(0, range.from) + source + markdown.slice(range.to)
    : markdown;
}
