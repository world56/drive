import {
  HomeOutlined,
  SyncOutlined,
  TableOutlined,
  SearchOutlined,
  FolderOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import styles from "./index.module.sass";
import { useStore, useToFolder } from "@/hooks";
import { isEmpty, stopPropagation } from "@/utils";
import { Dropdown, Empty, Spin, Breadcrumb } from "antd";

import type { MenuProps, SpinProps } from "antd";

/**
 * @name ENUM_CONTAINER_MENU_TYPE 容器选项菜单
 */
export enum ENUM_CONTAINER_MENU_TYPE {
  /** @param UPLOAD_FILE 上传文件 */
  UPLOAD_FILE = "UPLOAD_FILE",
  /** @param UPLOAD_FOLDER 上传文件夹 */
  UPLOAD_FOLDER = "UPLOAD_FOLDER",
  /** @param MKDIR 创建文件夹 */
  MKDIR = "MKDIR",
  /** @param REFRESH 刷新当前资源列表 */
  REFRESH = "REFRESH",
  /** @param SEARCH 搜索 */
  SEARCH = "SEARCH",
  /** @param LAYOUT_LIST 布局-列表 */
  LAYOUT_LIST = "LAYOUT_LIST",
  /** @param LAYOUT_THUMBNAIL 布局-缩略图 */
  LAYOUT_THUMBNAIL = "LAYOUT_THUMBNAIL",
}

export interface TypeFilesContainerProps {
  children?: React.ReactNode;
  /** @param loading 加载效果 */
  loading: SpinProps["spinning"];
  /**
   * @name onMenu 资源列表容器菜单事件
   * @description 鼠标右键点击文件列表容器菜单
   */
  onMenu(type: ENUM_CONTAINER_MENU_TYPE, id?: string): void;
}

const items: MenuProps["items"] = [
  {
    icon: <FileAddOutlined />,
    label: "上传文件",
    key: ENUM_CONTAINER_MENU_TYPE.UPLOAD_FILE,
  },
  {
    icon: <FolderAddOutlined />,
    label: "上传文件夹",
    key: ENUM_CONTAINER_MENU_TYPE.UPLOAD_FOLDER,
  },
  { type: "divider" },
  {
    icon: <FolderOutlined />,
    label: "新建文件夹",
    key: ENUM_CONTAINER_MENU_TYPE.MKDIR,
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
      { label: "缩略图", key: "12" },
      { label: "列表", key: "14" },
    ],
  },
  { type: "divider" },
  {
    icon: <SearchOutlined />,
    label: "搜索",
    key: 13,
  },
  {
    icon: <SyncOutlined />,
    label: "刷新",
    key: ENUM_CONTAINER_MENU_TYPE.REFRESH,
  },
];

/**
 * @name Container 文件列表容器
 * @description 抽离非核心UI、功能
 */
const Container: React.FC<TypeFilesContainerProps> = ({
  onMenu,
  loading,
  children,
}) => {
  const resource = useStore("resource");

  const toFolder = useToFolder();

  const { path, foldersObj } = resource;

  const route = useMemo(
    () => [
      {
        title: (
          <>
            <HomeOutlined />
            {path.length ? null : <span>主目录</span>}
          </>
        ),
        key: "resource",
        onClick: () => toFolder(),
      },
      ...path.map((id) => ({
        key: id,
        title: foldersObj?.[id]?.name,
        onClick: () => toFolder(id),
      })),
    ],
    [path, foldersObj, toFolder],
  );

  const onMenuClick: MenuProps["onClick"] = (e) => {
    onMenu(e.key as ENUM_CONTAINER_MENU_TYPE, resource.path.at(-1));
  };

  return (
    <div className={styles.files}>
      <Breadcrumb items={route} className={styles.nav} />
      {loading ? <Spin spinning={loading} /> : null}
      <Dropdown
        trigger={["contextMenu"]}
        menu={{ items, onClick: onMenuClick }}
      >
        <div className={styles.layout} onContextMenu={stopPropagation}>
          {isEmpty(children) ? (
            <Empty
              description="资源列表为空"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            children
          )}
        </div>
      </Dropdown>
    </div>
  );
};

export default Container;
