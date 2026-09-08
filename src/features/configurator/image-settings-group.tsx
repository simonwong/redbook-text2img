"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { imageAssets } from "@/lib/image-assets/image-assets";
import { imageReference } from "@/lib/image-reference";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useMarkdownContentStore } from "@/store/markdownContent";
import { CleanImagesButton } from "./clean-images-button";
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
  const [message, setMessage] = useState("");
  const dismissMessage = useCallback(() => setMessage(""), []);
  const [hasAssets, setHasAssets] = useState(false);
  useEffect(() => {
    let active = true;
    let revision = 0;
    async function refresh() {
      revision += 1;
      const current = revision;
      const ids = await imageAssets.list().catch(() => []);
      if (active && current === revision) {
        setHasAssets(ids.length > 0);
      }
    }
    const unsubscribe = imageAssets.subscribe(refresh);
    refresh();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  if (!(hasImages || hasAssets || message)) {
    return null;
  }
  return (
    <SettingsGroup headingId="image-section-heading" title="图片">
      {hasImages && (
        <>
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
        </>
      )}
      {hasAssets ? <CleanImagesButton onMessage={setMessage} /> : null}
      {message ? (
        <div className="space-y-2 text-ink-2 text-xs">
          <p role="status">{message}</p>
          <Button
            onClick={dismissMessage}
            size="sm"
            type="button"
            variant="ghost"
          >
            知道了
          </Button>
        </div>
      ) : null}
    </SettingsGroup>
  );
};
