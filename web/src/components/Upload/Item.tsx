import { memo } from "react";
import styles from "./index.module.sass";
import { getFileIcon } from "@/utils/file";
import { ReloadOutlined, FolderOutlined } from "@ant-design/icons";

import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeUploadStatus } from "./utils";
import type { ListChildComponentProps } from "react-window";

type TypeItemProps = Array<TypeUploadStatus[keyof TypeUploadStatus]>;

/**
 * @name Item 资源状态
 */
const Item: React.FC<ListChildComponentProps<TypeItemProps>> = ({
  data,
  index,
  style,
}) => {
  const target = data[index];

  const status = CONSTANT_RESOURCE.STATUS.OBJ[target.status];

  return (
    <div className={styles.item} style={style}>
      <img src={getFileIcon(target.suffix)} alt="#" />
      <div>
        <p>{target?.name}</p>
        <p style={{ color: status.color }}>
          <span>{status.name}</span>
          &nbsp;
          <span>{target.progress}%</span>
        </p>
      </div>
      <div className={styles.btn}>
        <FolderOutlined />
        <ReloadOutlined />
      </div>
    </div>
  );
};

export default memo(Item);
