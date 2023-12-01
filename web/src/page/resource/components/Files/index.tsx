import Container from "./Container";
import Thumbnail from "./Thumbnail";
import { useToFolder } from "@/hooks";
import { getResources } from "@/api/resource";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeThumbnailProps } from "./Thumbnail";
import type { TypeFilesContainerProps } from "./Container";

export interface TypeFilesProps
  extends Pick<TypeFilesContainerProps, "onMenu" | "loading">,
    Pick<TypeThumbnailProps, "onItemMenu"> {
  /** @param list 资源列表 */
  data?: Awaited<ReturnType<typeof getResources>>;
}

/**
 * @name ENUM_RESOURCE_MENU_TYPE 资源选项菜单
 */
export enum ENUM_RESOURCE_MENU_TYPE {
  /** @param OPEN 打开、预览 文件、文件夹 */
  OPEN = "OPEN",
  /** @param COPY_NAME 复制名称 */
  COPY_NAME = "COPY_NAME",
  /** @param COLLECT 收藏 */
  COLLECT = "COLLECT",
  /** @param EDIT 编辑 */
  EDIT = "EDIT",
  /** @param MOVE 移动 */
  MOVE = "MOVE",
  /** @param DOWNLOAD 下载 */
  DOWNLOAD = "DOWNLOAD",
  /** @param DELETE 删除 */
  DELETE = "DELETE",
  /** @param FAVORITE 收藏 */
  FAVORITE = "FAVORITE",
  /**
   * @param ATTRIBUTES 属性
   * @description 逻辑跟Mac、Windows查看逻辑差不多
   */
  ATTRIBUTES = "ATTRIBUTES",
}

/**
 * @name Files 文件列表
 */
const Files: React.FC<TypeFilesProps> = ({
  data,
  onMenu,
  loading,
  onItemMenu,
}) => {
  const toFolder = useToFolder();

  // 预览、打开
  const onPreview: TypeThumbnailProps["onPreview"] = (type, id) => {
    switch (type) {
      case ENUM_RESOURCE.TYPE.FOLDER:
        return toFolder(id);
      default:
        return;
    }
  };

  return (
    <Container loading={loading} onMenu={onMenu}>
      <Thumbnail data={data} onPreview={onPreview} onItemMenu={onItemMenu} />
    </Container>
  );
};

export default Files;
export { ENUM_CONTAINER_MENU_TYPE } from "./Container";
