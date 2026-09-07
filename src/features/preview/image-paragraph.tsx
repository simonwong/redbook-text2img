import type { ComponentProps, CSSProperties } from "react";
import type { ExtraProps } from "react-markdown";

interface ImageParagraphProps extends ComponentProps<"p">, ExtraProps {
  figureStyle: CSSProperties;
}

export function ImageParagraph({
  children,
  node,
  style,
  figureStyle,
}: ImageParagraphProps) {
  const nodes = node?.children.filter(
    (child) => child.type !== "text" || child.value.trim() !== ""
  );
  const onlyImage =
    nodes?.length === 1 &&
    nodes[0].type === "element" &&
    nodes[0].tagName === "img";
  return onlyImage ? (
    <figure style={figureStyle}>{children}</figure>
  ) : (
    <p style={style}>{children}</p>
  );
}
