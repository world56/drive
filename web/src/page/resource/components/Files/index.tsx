import Container from "./Container";
import Thumbnail from "./Thumbnail";
import { useMemo, useRef } from "react";
import { getResources } from "@/api/resource";
import { RESOURCE_SORTERS } from "@/utils/filter";
import { usePreviewFile, useStore, useToFolder } from "@/hooks";

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
  const toFolder = useToFolder();
  const onPreviewFile = usePreviewFile();
  const { sort } = useStore("resource");

  const list = useMemo(() => {
    if (!data?.length) return data;
    const compare =
      RESOURCE_SORTERS[sort.type] ??
      RESOURCE_SORTERS[ENUM_RESOURCE.MENU.SORT_CREATE_TIME];
    const dir = sort.order === ENUM_RESOURCE.MENU.SORT_DESC ? -1 : 1;
    return data.slice().sort((a, b) => dir * compare(a, b));
  }, [data, sort]);

  const dataCache = useRef<Record<string, NonNullable<typeof data>[number]>>();

  // 预览、打开
  const onPreview: TypeThumbnailProps["onPreview"] = (type, id) => {
    if (type === ENUM_RESOURCE.TYPE.FOLDER) return toFolder(id);
    if (!dataCache.current?.[id]) {
      dataCache.current = Object.fromEntries(data!.map((v) => [v.id, v]));
    }
    onPreviewFile(dataCache.current[id]);
  };

  return (
    <Container loading={loading} onMenu={onMenu}>
      <Thumbnail data={list} onPreview={onPreview} onMenu={onMenu} />
    </Container>
  );
};

export default Files;
