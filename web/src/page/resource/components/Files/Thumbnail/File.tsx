import { memo } from "react";
import { Tooltip } from "antd";
import { filesize } from "filesize";
import styles from "./index.module.sass";
import { HeartFilled } from "@ant-design/icons";
import { getResourceIcon } from "@/utils/resource";

import { ENUM_RESOURCE } from "@/enum/resource";
import { ICON_THRESHOLD } from "@/config/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeResource.DTO> = (props) => {
  const { id, type, size, fullName, suffix } = props;
  const IS_FOLDER = type === ENUM_RESOURCE.TYPE.FOLDER;
  return (
    <div
      data-id={id}
      data-type={type}
      className={styles.file}
      data-full-name={fullName}
    >
      <span>
        <img
          alt="#"
          className={
            IS_FOLDER
              ? styles.folder
              : type === ENUM_RESOURCE.TYPE.IMAGE && size! < ICON_THRESHOLD
              ? styles.img
              : styles.icon
          }
          src={getResourceIcon(props)}
        />
      </span>
      <p>{props.name}</p>
      <p>
        <span>{IS_FOLDER ? `${size} 个` : filesize(size!).toString()}</span>
        <span>{CONSTANT_RESOURCE.TYPE.OBJ[type].name}</span>
        <span>{IS_FOLDER ? "文件夹" : suffix}</span>
        <Tooltip title="收藏" mouseEnterDelay={1}>
          <HeartFilled />
        </Tooltip>
      </p>
    </div>
  );
};

export default memo(File);
