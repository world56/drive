import {
  SyncOutlined,
  TableOutlined,
  FolderAddOutlined,
  CloudUploadOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import Navigation from "./Navigation";
import styles from "../index.module.sass";

import type { ItemType } from "antd/es/menu/hooks/useItems";
import File from "../File";

const items: ItemType[] = [
  {
    icon: <CloudUploadOutlined />,
    label: "上传资源",
    key: "1",
  },
  {
    icon: <FolderAddOutlined />,
    label: "新建文件夹",
    key: "2",
  },
  { type: "divider" },
  {
    icon: <SortDescendingOutlined />,
    label: "排序",
    key: "3",
    children: [
      { label: "名称", key: "4" },
      { label: "大小", key: "5" },
      { label: "格式", key: "6" },
      { label: "类型", key: "7" },
      { label: "创建人", key: "8" },
      { label: "创建时间", key: "9" },
    ],
  },
  {
    icon: <TableOutlined />,
    label: "显示",
    key: "11",
    children: [
      { label: "图标", key: "12" },
      { label: "列表", key: "13" },
      { label: "大图", key: "14" },
    ],
  },
  { type: "divider" },
  {
    icon: <SyncOutlined />,
    label: "刷新",
    key: "0",
  },
];

const Files = () => {
  return (
    <div className={styles.files}>
      <Navigation />
      <Dropdown menu={{ items }} trigger={["contextMenu"]}>
        <div className={styles.layout}>
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
          <File />
        </div>
      </Dropdown>
    </div>
  );
};

export default Files;
