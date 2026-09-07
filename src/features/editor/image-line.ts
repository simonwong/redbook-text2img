import { fromMarkdown } from "mdast-util-from-markdown";
import {
  type ContentImageReference,
  imageReference,
} from "@/lib/image-reference";

const sourcePattern =
  /\]\(\s*<?(image:[^\s>)]+)>?(?:\s+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?\s*\)\s*$/;

function locate(line: string) {
  const tree = fromMarkdown(line);
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
  const reference = imageReference.parse(image.url);
  const match = sourcePattern.exec(line);
  if (!(reference && match) || match[1] !== image.url) {
    return null;
  }
  const from = match.index + match[0].indexOf(match[1]);
  return {
    from,
    reference,
    to: from + match[1].length,
  };
}

export const imageLine = {
  read(line: string): ContentImageReference | null {
    return locate(line)?.reference ?? null;
  },
  update(
    line: string,
    patch: Partial<Pick<ContentImageReference, "align" | "size">>
  ): string {
    const found = locate(line);
    if (!found) {
      return line;
    }
    return (
      line.slice(0, found.from) +
      imageReference.format({ ...found.reference, ...patch }) +
      line.slice(found.to)
    );
  },
};
