import {
  EyeOutlined,
  FormOutlined,
  DragOutlined,
  HeartOutlined,
  DeleteOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { Dropdown } from "antd";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";

import type { MenuProps } from "antd";
import type { TypeResource } from "@/interface/resource";

const items: MenuProps["items"] = [
  {
    icon: <EyeOutlined />,
    label: "预览",
    key: 0,
  },
  {
    icon: <HeartOutlined />,
    label: "收藏",
    key: 1,
  },
  { type: "divider" },
  {
    icon: <FormOutlined />,
    label: "编辑",
    key: 2,
  },
  {
    icon: <DragOutlined />,
    label: "移动至",
    key: 3,
  },
  { type: "divider" },
  {
    icon: <CloudDownloadOutlined />,
    label: "下载",
    key: 5,
  },
  {
    icon: <DeleteOutlined className="red" />,
    label: <span className="red">删除</span>,
    key: 6,
  },
];

/**
 * @name File 资源、文件图标
 */
const File: React.FC<TypeResource.DTO> = (props) => {
  return (
    <Dropdown menu={{ items }} destroyPopupOnHide trigger={["contextMenu"]}>
      <div
        data-id={props.id}
        data-type={props.type}
        className={styles.file}
        onContextMenu={stopPropagation}
      >
        <span>
          <img
            src="https://img.pconline.com.cn/images/upload/upc/tx/photoblog/1411/24/c6/41272187_41272187_1416843675065.jpg"
            alt="#"
          />
        </span>
        <p>{props.name}</p>
        <p>
          <span>3MB</span>
          <span>文档</span>
        </p>
      </div>
    </Dropdown>
  );
};

export default memo(File);
