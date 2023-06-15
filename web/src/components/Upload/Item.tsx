import {
  PauseOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FolderOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import styles from "./index.module.sass";
import { getFileIcon } from "@/utils/file";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeUploadStatus } from "./utils";
import type { ListChildComponentProps } from "react-window";

type TypeItemProps<T = TypeUploadStatus> = Array<T[keyof T]>;

/**
 * @name Item 资源状态
 */
const Item: React.FC<ListChildComponentProps<TypeItemProps>> = ({
  data,
  index,
  style,
}) => {
  const { status, suffix, name, progress } = data[index];

  const STATUS = CONSTANT_RESOURCE.STATUS.OBJ[status];

  const BTN = {
    // 完成
    [ENUM_RESOURCE.STATUS.DONE]: <FolderOutlined />,
    // 上传中
    [ENUM_RESOURCE.STATUS.UPLOADING]: <PauseOutlined />,
    // 暂停
    [ENUM_RESOURCE.STATUS.PAUSE]: <CaretRightOutlined />,
    // 失败
    [ENUM_RESOURCE.STATUS.ERROR]: <ReloadOutlined />,
  };

  return (
    <div className={styles.item} style={style}>
      <img src={getFileIcon(suffix)} alt="#" />
      <div>
        <p>{name}</p>
        <p style={{ color: STATUS.color }}>
          <span>{STATUS.name}</span>
          &nbsp;
          <span>{progress}%</span>
        </p>
      </div>
      <div className={styles.btn}>
        {BTN[status]}
        <DeleteOutlined
          className={status !== ENUM_RESOURCE.STATUS.UPLOADING ? "" : "none"}
        />
      </div>
    </div>
  );
};

export default memo(Item);
