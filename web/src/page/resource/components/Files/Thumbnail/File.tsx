import {
  EyeOutlined,
  FormOutlined,
  DragOutlined,
  HeartOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { Dropdown } from "antd";
import { filesize } from "filesize";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { getResourceIcon } from "@/utils/resource";

import { ENUM_RESOURCE_MENU_TYPE } from "..";
import { ENUM_RESOURCE } from "@/enum/resource";
import { ICON_THRESHOLD } from "@/config/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { MenuProps } from "antd";
import type { TypeResource } from "@/interface/resource";

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeResource.DTO> = (props) => {
  const { id, type, size } = props;

  const IS_FOLDER = type === ENUM_RESOURCE.TYPE.FOLDER;

  const items: MenuProps["items"] = [
    {
      icon: IS_FOLDER ? <FolderOpenOutlined /> : <EyeOutlined />,
      label: IS_FOLDER ? "打开" : "预览",
      key: `^${ENUM_RESOURCE_MENU_TYPE.OPEN}^${id}`,
    },
    {
      icon: <HeartOutlined />,
      label: "收藏",
      key: `^${ENUM_RESOURCE_MENU_TYPE.COLLECT}^${id}`,
    },
    { type: "divider" },
    {
      icon: <FormOutlined />,
      label: "编辑",
      key: `^${ENUM_RESOURCE_MENU_TYPE.EDIT}^${id}`,
    },
    {
      icon: <DragOutlined />,
      label: "移动至",
      key: `^${ENUM_RESOURCE_MENU_TYPE.MOVE}^${id}`,
    },
    { type: "divider" },
    {
      icon: <CloudDownloadOutlined />,
      label: "下载",
      key: `^${ENUM_RESOURCE_MENU_TYPE.DOWNLOAD}^${id}`,
    },
    {
      icon: <DeleteOutlined className="red" />,
      label: <span className="red">删除</span>,
      key: `^${ENUM_RESOURCE_MENU_TYPE.DELETE}^${id}`,
    },
  ];

  return (
    <Dropdown menu={{ items }} destroyPopupOnHide trigger={["contextMenu"]}>
      <div
        data-id={id}
        data-type={type}
        className={styles.file}
        onContextMenu={stopPropagation}
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
          <span>{IS_FOLDER ? `${size} 个` : filesize(size).toString()}</span>
          <span>{CONSTANT_RESOURCE.TYPE.OBJ[type].name}</span>
        </p>
      </div>
    </Dropdown>
  );
};

export default memo(File);
