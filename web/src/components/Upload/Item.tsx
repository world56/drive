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
import { ENUM_UPLOAD_EVENT } from "./Container";

type TypeItemProps<T = TypeUploadStatus> = Array<T[keyof T]>;

/**
 * @name Item 资源状态
 */
const Item: React.FC<ListChildComponentProps<TypeItemProps>> = ({
  data,
  index,
  style,
}) => {
  const { id, status, suffix, name, progress } = data[index];

  const STATUS = CONSTANT_RESOURCE.STATUS.OBJ[status];

  const dataset = { ["data-id"]: id };

  const BTN = {
    // 完成
    [ENUM_RESOURCE.STATUS.DONE]: (
      <FolderOutlined {...dataset} data-type={ENUM_UPLOAD_EVENT.CD} />
    ),
    // 上传中
    [ENUM_RESOURCE.STATUS.UPLOADING]: (
      <PauseOutlined {...dataset} data-type={ENUM_UPLOAD_EVENT.PAUSE} />
    ),
    // 暂停
    [ENUM_RESOURCE.STATUS.PAUSE]: (
      <CaretRightOutlined {...dataset} data-type={ENUM_UPLOAD_EVENT.START} />
    ),
    // 失败
    [ENUM_RESOURCE.STATUS.ERROR]: (
      <ReloadOutlined {...dataset} data-type={ENUM_UPLOAD_EVENT.START} />
    ),
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
        <DeleteOutlined
          {...dataset}
          data-type={ENUM_UPLOAD_EVENT.EMPTY}
          className={status !== ENUM_RESOURCE.STATUS.UPLOADING ? "" : "none"}
        />
        {BTN[status]}
      </div>
    </div>
  );
};

export default memo(Item);
