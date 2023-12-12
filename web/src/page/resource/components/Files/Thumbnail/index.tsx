import File from "./File";
import styles from "./index.module.sass";
import EmptyPrompt from "../EmptyPrompt";

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

  const length = data?.files.length! + data?.folders.length!;

  return length ? (
    <div className={styles.thumbnail} onDoubleClick={onDoubleClick}>
      <div className={styles.list}>
        {data?.folders.map((v) => (
          <File key={v.id} {...v} />
        ))}
      </div>
      <div className={styles.list}>
        {data?.files.map((v) => (
          <File key={v.id} {...v} />
        ))}
      </div>
    </div>
  ) : (
    <EmptyPrompt onMenu={onMenu} />
  );
};

export default Thumbnail;
