import {
  TagOutlined,
  AudioOutlined,
  FolderOutlined,
  PictureOutlined,
  FileZipOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Checkbox } from "antd";
import styles from "./index.module.sass";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { CheckboxGroupProps } from "antd/es/checkbox";

const ICON = {
  [ENUM_RESOURCE.TYPE.AUDIO]: <AudioOutlined />,
  [ENUM_RESOURCE.TYPE.COMPRESSED]: <FileZipOutlined />,
  [ENUM_RESOURCE.TYPE.DOCUMENT]: <FileTextOutlined />,
  [ENUM_RESOURCE.TYPE.FOLDER]: <FolderOutlined />,
  [ENUM_RESOURCE.TYPE.IMAGE]: <PictureOutlined />,
  [ENUM_RESOURCE.TYPE.VIDEO]: <VideoCameraOutlined />,
  [ENUM_RESOURCE.TYPE.OTHER]: <TagOutlined />,
};

const SEARCH_OPTIONS = CONSTANT_RESOURCE.TYPE.LIST.map((v) => ({
  value: v.id,
  label: (
    <>
      {ICON[v.id]}&nbsp;{v.name}
    </>
  ),
}));

interface TypeSelectResourcesProps
  extends Omit<CheckboxGroupProps, "options" | "onChange"> {
  onChange?(e: ENUM_RESOURCE.TYPE[]): void;
}

/**
 * @name SelectResources 资源类型选择
 * @description 固定了选项
 */
const SelectResources: React.FC<TypeSelectResourcesProps> = ({
  className,
  onChange,
  ...props
}) => (
  <Checkbox.Group
    {...props}
    options={SEARCH_OPTIONS}
    className={`${styles.select}${className || ""}`}
    onChange={onChange as CheckboxGroupProps["onChange"]}
  />
);

export default SelectResources;
