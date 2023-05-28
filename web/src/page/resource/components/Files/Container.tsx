import {
  HomeOutlined,
  SyncOutlined,
  TableOutlined,
  FolderAddOutlined,
  CloudUploadOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { Dropdown, Empty, Breadcrumb, Button, Spin } from "antd";

import type { TypeFilesProps } from ".";
import type { MenuProps, SpinProps } from "antd";

export enum ENUM_MENU_TYPE {
  /** @param UPLOAD 上传资源 */
  UPLOAD = "UPLOAD",
  /** @param MKDIR 创建文件夹 */
  MKDIR = "MKDIR",
  /** @param REFRESH 刷新当前文件夹 */
  REFRESH = "REFRESH",
}

export interface TypeFilesContainerProps extends TypeFilesProps {
  children?: React.ReactNode;
  /** @param loading 加载效果 */
  loading: SpinProps["spinning"];
  /** @param onMenu 鼠标右键菜单操作 */
  onMenu: MenuProps["onClick"];
  /** @param onSelect 选择对应的资源菜单操作 */
  onSelect(e: React.MouseEvent<HTMLDivElement>): void;
}

const items: MenuProps["items"] = [
  {
    icon: <CloudUploadOutlined />,
    label: "上传资源",
    key: ENUM_MENU_TYPE.UPLOAD,
  },
  {
    icon: <FolderAddOutlined />,
    label: "新建文件夹",
    key: ENUM_MENU_TYPE.MKDIR,
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
      { label: "小图标", key: "12" },
      { label: "大图标", key: "14" },
    ],
  },
  { type: "divider" },
  {
    icon: <SyncOutlined />,
    label: "刷新",
    key: ENUM_MENU_TYPE.REFRESH,
  },
];

/**
 * @name Container 文件列表容器
 * @description 抽离非核心UI、功能
 */
const Container: React.FC<TypeFilesContainerProps> = ({
  onMenu,
  loading,
  onSelect,
  children,
}) => (
  <div className={styles.files}>
    <div className={styles.nav}>
      <Breadcrumb
        items={[
          { title: <HomeOutlined /> },
          { title: "视频资源" },
          { title: "国产电影" },
          { title: "流浪地球" },
        ]}
      />
      <Button icon={<CloudUploadOutlined />} size="small">
        上传
      </Button>
    </div>
    <Spin spinning={loading} tip="正在加载资源目录" />
    <Dropdown trigger={["contextMenu"]} menu={{ items, onClick: onMenu }}>
      <div
        onClick={onSelect}
        className={styles.layout}
        onContextMenu={stopPropagation}
      >
        {children || (
          <Empty
            description="资源目录为空"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </Dropdown>
  </div>
);

export default Container;
