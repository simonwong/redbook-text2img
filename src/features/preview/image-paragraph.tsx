import type { ComponentProps } from "react";
import type { ExtraProps } from "react-markdown";

import { imageReference } from "@/lib/image-reference";
import type { GeneratedStyles } from "@/lib/theme/generator";

interface ImageParagraphProps extends ComponentProps<"p">, ExtraProps {
  imageLayout: GeneratedStyles["imageLayout"];
}

export function ImageParagraph({
  children,
  node,
  style,
  imageLayout,
}: ImageParagraphProps) {
  const nodes = node?.children.filter(
    (child) => child.type !== "text" || child.value.trim() !== ""
  );
  const onlyImage =
    nodes?.length === 1 &&
    nodes[0].type === "element" &&
    nodes[0].tagName === "img";
  if (!onlyImage || nodes[0].type !== "element") {
    return <p style={style}>{children}</p>;
  }
  const reference = imageReference.parse(String(nodes[0].properties.src ?? ""));
  const { align, size } = reference ?? { align: "center", size: "full" };
  const layout = imageLayout[align][size];
  return (
    <figure style={layout.figure}>
      <div style={layout.container}>{children}</div>
    </figure>
  );
}
