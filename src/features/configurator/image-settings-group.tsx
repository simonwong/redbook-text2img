"use client";

import { imageReference } from "@/lib/image-reference";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { ConfigurationSegmentRow } from "./configuration-segment-row";
import { SettingsGroup } from "./settings-group";

const options = styleSystem.configurationOptions();
const radiusLabels: Record<StyleConfiguration["imageRadius"], string> = {
  large: "大",
  none: "无",
  small: "小",
};
const shadowLabels: Record<StyleConfiguration["imageShadow"], string> = {
  light: "轻",
  none: "无",
  strong: "重",
};
const radiusOptions = options.imageRadius.map((value) => ({
  label: radiusLabels[value],
  value,
}));
const shadowOptions = options.imageShadow.map((value) => ({
  label: shadowLabels[value],
  value,
}));

export const ImageSettingsGroup = () => {
  const hasImages = useMarkdownContentStore((state) =>
    imageReference.hasImages(state.content)
  );
  if (!hasImages) {
    return null;
  }
  return (
    <SettingsGroup headingId="image-section-heading" title="图片">
      <ConfigurationSegmentRow
        field="imageRadius"
        label="圆角"
        labelId="image-radius-label"
        options={radiusOptions}
      />
      <ConfigurationSegmentRow
        field="imageShadow"
        label="阴影"
        labelId="image-shadow-label"
        options={shadowOptions}
      />
    </SettingsGroup>
  );
};
