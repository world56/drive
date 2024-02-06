import { memo } from "react";
import { Tooltip } from "antd";
import { filesize } from "filesize";
import styles from "./index.module.sass";
import { HeartFilled } from "@ant-design/icons";
import ResourceIcon from "@/components/ResourceIcon";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeResource.DTO> = (props) => {
  const { id, type, size, fullName, suffix, favorite, path } = props;
  const IS_IMAGE = type === ENUM_RESOURCE.TYPE.IMAGE;
  const IS_FOLDER = type === ENUM_RESOURCE.TYPE.FOLDER;
  const IS_FAVORITE = favorite === ENUM_RESOURCE.FAVORITE.ENABLE;

  return (
    <div
      data-id={id}
      data-type={type}
      className={styles.file}
      data-favorite={favorite}
      data-full-name={fullName}
    >
      <span>
        <ResourceIcon
          size={size}
          type={type}
          path={path}
          suffix={suffix}
          width={IS_FOLDER ? 60 : IS_IMAGE ? "100%" : 52}
        />
      </span>
      <p>{props.name}</p>
      <p>
        <span>{IS_FOLDER ? `${size} 个` : filesize(size!).toString()}</span>
        <span>{CONSTANT_RESOURCE.TYPE.OBJ[type].name}</span>
        <span>{IS_FOLDER ? "文件夹" : suffix}</span>
        <Tooltip title="收藏" mouseEnterDelay={1}>
          <HeartFilled
            style={IS_FAVORITE ? { color: "red" } : { display: "none" }}
          />
        </Tooltip>
      </p>
    </div>
  );
};

export default memo(File);
