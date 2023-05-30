import File from "./File";
import Container from "./Container";
import { useToFolder } from "../../hooks";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeResource } from "@/interface/resource";
import type { TypeFilesContainerProps } from "./Container";

export interface TypeFilesProps
  extends Pick<TypeFilesContainerProps, "onMenu" | "loading"> {
  /** @param list 资源列表 */
  list?: TypeResource.DTO[];
}

/**
 * @name Files 文件列表
 */
const Files: React.FC<TypeFilesProps> = ({ list, onMenu, loading }) => {

  const toFolder = useToFolder();

  // 预览、打开
  const onPreview: TypeFilesContainerProps["onPreview"] = (type, id) => {
    switch (type) {
      case ENUM_RESOURCE.TYPE.FOLDER:
        return toFolder(id);
      default:
        return;
    }
  };

  return (
    <Container loading={loading} onMenu={onMenu} onPreview={onPreview}>
      {list?.map((v) => (
        <File key={v.id} {...v} />
      ))}
    </Container>
  );
};

export default Files;
export { ENUM_MENU_TYPE } from "./Container";
