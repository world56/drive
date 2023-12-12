import Container from "./Container";
import Thumbnail from "./Thumbnail";
import { useToFolder } from "@/hooks";
import { getResources } from "@/api/resource";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeThumbnailProps } from "./Thumbnail";
import type { TypeFilesContainerProps } from "./Container";

export interface TypeFilesProps
  extends Pick<TypeFilesContainerProps, "onMenu" | "onItemMenu" | "loading"> {
  /** @param list 资源列表 */
  data?: Awaited<ReturnType<typeof getResources>>;
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
    <Container loading={loading} onMenu={onMenu} onItemMenu={onItemMenu}>
      <Thumbnail data={data} onPreview={onPreview} onMenu={onMenu} />
    </Container>
  );
};

export default Files;
