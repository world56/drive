import { useActions } from ".";

import { PREVIEW_RESOURCE } from "@/config/resource";

import type { TypeResource } from "@/interface/resource";

/**
 * @name usePreviewFile 预览文件
 */
export default function usePreviewFile() {
  const actions = useActions();

  function onPreview(value: TypeResource.DTO) {
    if (PREVIEW_RESOURCE.IMAGE.includes(value.suffix)) {
      actions.preview({ key: "images", value });
    } else if (PREVIEW_RESOURCE.AUDIO.includes(value.suffix)) {
      actions.preview({ key: "audios", value });
    } else if (PREVIEW_RESOURCE.VIDEO.includes(value.suffix)) {
      actions.preview({ key: "videos", value });
    }
  }

  return onPreview;
}
