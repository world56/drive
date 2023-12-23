import {
  PauseOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FolderOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import styles from "./index.module.sass";
import { getFileSuffixIcon } from "@/components/ResourceIcon";

import { ENUM_UPLOAD_EVENT } from ".";
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
  const { id, status, suffix, name, progress, size, parentId } = data[index];

  const STATUS = CONSTANT_RESOURCE.STATUS.OBJ[status];

  const BTN = {
    // 完成 (parentId)
    [ENUM_RESOURCE.STATUS.DONE]: (
      <FolderOutlined data-id={parentId} data-type={ENUM_UPLOAD_EVENT.CD} />
    ),
    // 上传中
    [ENUM_RESOURCE.STATUS.UPLOADING]: (
      <PauseOutlined data-id={id} data-type={ENUM_UPLOAD_EVENT.PAUSE} />
    ),
    // 暂停
    [ENUM_RESOURCE.STATUS.PAUSE]: (
      <CaretRightOutlined data-id={id} data-type={ENUM_UPLOAD_EVENT.START} />
    ),
    // 失败
    [ENUM_RESOURCE.STATUS.ERROR]: (
      <ReloadOutlined data-id={id} data-type={ENUM_UPLOAD_EVENT.START} />
    ),
  };

  return (
    <div className={styles.item} style={style}>
      <img src={getFileSuffixIcon(suffix)} alt="#" />
      <div>
        <p>{name}</p>
        <p style={{ color: STATUS.color }}>
          <span>{STATUS.name}</span>
          <span>{progress}%</span>
          <span>{size}</span>
        </p>
      </div>
      <div className={styles.btn}>
        <DeleteOutlined
          data-id={id}
          data-type={ENUM_UPLOAD_EVENT.DELETE}
          className={status !== ENUM_RESOURCE.STATUS.UPLOADING ? "" : "none"}
        />
        {BTN[status]}
      </div>
    </div>
  );
};

export default memo(Item);
