import { useRef } from "react";
import Container from "./Container";
import Thumbnail from "./Thumbnail";
import { getResources } from "@/api/resource";
import { useActions, useStore, useToFolder } from "@/hooks";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeThumbnailProps } from "./Thumbnail";
import type { TypeFilesContainerProps } from "./Container";

export interface TypeFilesProps
  extends Pick<TypeFilesContainerProps, "onMenu" | "loading"> {
  /** @param list 资源列表 */
  data?: Awaited<ReturnType<typeof getResources>>;
}

/**
 * @name Files 文件列表
 */
const Files: React.FC<TypeFilesProps> = ({ data, onMenu, loading }) => {
  const dataCache = useRef<Record<string, NonNullable<typeof data>[number]>>();

  const actions = useActions();
  const { selects } = useStore("resource");

  const toFolder = useToFolder();

  // 预览、打开
  const onPreview: TypeThumbnailProps["onPreview"] = (type, id) => {
    if (Object.keys(selects).length) return;
    switch (type) {
      case ENUM_RESOURCE.TYPE.FOLDER:
        return toFolder(id);
      case ENUM_RESOURCE.TYPE.IMAGE:
        if (!dataCache.current?.[id]) {
          dataCache.current = Object.fromEntries(data!.map((v) => [v.id, v]));
        }
        const resource = dataCache.current[id];
        actions.preview({ key: "images", value: resource });
        return;
      default:
        return;
    }
  };

  return (
    <Container loading={loading} onMenu={onMenu}>
      <Thumbnail data={data} onPreview={onPreview} onMenu={onMenu} />
    </Container>
  );
};

export default Files;
