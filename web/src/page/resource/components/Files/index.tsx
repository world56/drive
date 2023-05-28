import File from "./File";
import Container from "./Container";

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
  const onSelect: TypeFilesContainerProps["onSelect"] = (e) => {
    console.log(e);
  };

  return (
    <Container onMenu={onMenu} loading={loading} onSelect={onSelect}>
      {list?.map((v) => (
        <File key={v.id} {...v} />
      ))}
    </Container>
  );
};

export default Files;
export { ENUM_MENU_TYPE } from "./Container";
