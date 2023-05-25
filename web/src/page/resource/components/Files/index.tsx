import File from "./File";
import { useRequest } from "ahooks";
import { getResources } from "@/api/resource";
import Container, { TypeFilesContainerProps } from "./Container";

export interface TypeFilesProps
  extends Pick<TypeFilesContainerProps, "onMenu"> {}

/**
 * @name Files 文件列表
 */
const Files: React.FC<TypeFilesProps> = ({ onMenu }) => {
  const { data, loading } = useRequest(() => getResources({}));

  const onSelect: TypeFilesContainerProps["onSelect"] = (e) => {
    console.log(e);
  };

  return (
    <Container onMenu={onMenu} onSelect={onSelect} loading={loading}>
      {data?.map((v) => (
        <File key={v.id} {...v} />
      ))}
    </Container>
  );
};

export default Files;
export { ENUM_MENU_TYPE } from "./Container";
