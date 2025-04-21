import { memo } from "react";
import { Tooltip } from "antd";
import { useStore } from "@/hooks";
import { filesize } from "filesize";
import styles from "./index.module.sass";
import ResourceIcon from "@/components/Resource/Icon";
import { HeartFilled, CheckCircleTwoTone } from "@ant-design/icons";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";
import type { GridChildComponentProps } from "react-window";

interface TypeItemProps extends GridChildComponentProps<TypeResource.DTO[][]> {}

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeItemProps> = ({
  data,
  style,
  rowIndex,
  columnIndex,
}) => {
  if (!data?.[rowIndex]?.[columnIndex]) return null;
  const { selects } = useStore("resource");
  const { id, name, type, size, fullName, suffix, favorite, path } =
    data[rowIndex][columnIndex];
  const IS_IMAGE = type === ENUM_RESOURCE.TYPE.IMAGE;
  const IS_FOLDER = type === ENUM_RESOURCE.TYPE.FOLDER;
  const IS_FAVORITE = favorite === ENUM_RESOURCE.FAVORITE.ENABLE;
  const checked = selects[id];
  return (
    <div style={style}>
      <div
        data-id={id}
        data-type={type}
        data-favorite={favorite}
        data-full-name={fullName}
        className={`${styles.file} ${checked ? "" : styles.hover}`}
      >
        <span>
          <ResourceIcon
            type={type}
            path={path}
            suffix={suffix}
            width={IS_FOLDER ? 60 : IS_IMAGE ? "100%" : 52}
          />
        </span>
        <p>{name}</p>
        <p>
          <span>{IS_FOLDER ? `${size} 个` : filesize(size!).toString()}</span>
          {checked ? (
            <CheckCircleTwoTone twoToneColor="#1890ff" />
          ) : (
            <>
              <span>{CONSTANT_RESOURCE.TYPE.OBJ[type].name}</span>
              <span>{IS_FOLDER ? "文件夹" : suffix}</span>
            </>
          )}
          <Tooltip title="收藏" mouseEnterDelay={1}>
            <HeartFilled
              style={IS_FAVORITE ? { color: "#EA584A" } : { display: "none" }}
            />
          </Tooltip>
        </p>
      </div>
    </div>
  );
};

export default memo(File);
