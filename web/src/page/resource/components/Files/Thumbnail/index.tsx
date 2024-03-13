import File from "./File";
import { useMemo } from "react";
import { useDebounce } from "ahooks";
import styles from "./index.module.sass";
import EmptyPrompt from "../EmptyPrompt";
import { FixedSizeGrid } from "react-window";
import { useStore, useWindowSize } from "@/hooks";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeFilesProps } from "..";
import type { TypeResource } from "@/interface/resource";

export interface TypeThumbnailProps
  extends Pick<TypeFilesProps, "data" | "onMenu"> {
  /**
   * @name onPreview 双击 预览、打开文件夹
   * @description 这里只负责出参，不符合要求的双击事件，不会触发调用
   */
  onPreview(type: ENUM_RESOURCE.TYPE, id: TypeResource.DTO["id"]): void;
}

/**
 * @name Thumbnail 布局-缩略图
 */
const Thumbnail: React.FC<TypeThumbnailProps> = ({
  data,
  onMenu,
  onPreview,
}) => {
  const style = useWindowSize();

  const { FOLDER_TREE_WIDTH } = useStore("config");
  const folderWidth = useDebounce(FOLDER_TREE_WIDTH, { wait: 800 });

  /**
   * @name onDoubleClick 双击目标元素
   */
  function onDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("div");
    if (!ele?.dataset) return;
    const { type, id } = ele!.dataset;
    if (!type || !id) return;
    onPreview(Number(type), id);
  }

  const length = data?.length;

  const params = useMemo(() => {
    const length = data?.length || 0;
    const width = style.width - folderWidth - 93;
    const columnCount = Math.floor((width - 8) / 185);
    const itemData: TypeResource.DTO[][] = [];
    for (let i = 0; i < length; i += columnCount) {
      itemData.push((data || []).slice(i, i + columnCount));
    }
    return {
      width,
      itemData,
      columnCount,
      rowHeight: 170,
      columnWidth: 185,
      rowCount: itemData.length,
      height: style.height - 118,
    };
  }, [style, folderWidth, data]);

  return length ? (
    <div className={styles.thumbnail} onDoubleClick={onDoubleClick}>
      <FixedSizeGrid children={File} {...params} />
    </div>
  ) : (
    <EmptyPrompt onMenu={onMenu} />
  );
};

export default Thumbnail;
