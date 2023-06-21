import {
  SyncOutlined,
  TableOutlined,
  SearchOutlined,
  FolderOutlined,
  FileAddOutlined,
  FolderAddOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import Navigation from "./Navigation";
import styles from "./index.module.sass";
import { Dropdown, Empty, Spin, Tooltip } from "antd";
import { isEmpty, stopPropagation } from "@/utils";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeFilesProps } from ".";
import type { MenuProps, SpinProps } from "antd";
import type { TypeResource } from "@/interface/resource";

export enum ENUM_MENU_TYPE {
  /** @param UPLOAD_FILE 上传文件 */
  UPLOAD_FILE = "UPLOAD_FILE",
  /** @param UPLOAD_FOLDER 上传文件夹 */
  UPLOAD_FOLDER = "UPLOAD_FOLDER",
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
  /**
   * @name onPreview 双击 预览、打开文件夹
   * @description 这里只负责出参，不符合要求的双击事件，不会触发调用
   */
  onPreview(type: ENUM_RESOURCE.TYPE, id: TypeResource.DTO["id"]): void;
}

const items: MenuProps["items"] = [
  {
    icon: <FileAddOutlined />,
    label: "上传文件",
    key: ENUM_MENU_TYPE.UPLOAD_FILE,
  },
  {
    icon: <FolderAddOutlined />,
    label: "上传文件夹",
    key: ENUM_MENU_TYPE.UPLOAD_FOLDER,
  },
  { type: "divider" },
  {
    icon: <FolderOutlined />,
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
  children,
  onPreview,
}) => {
  /**
   * @name onDoubleClick 双击目标元素
   */
  function onDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("div");
    const { type, id } = ele!.dataset;
    if (!type || !id) return;
    onPreview(Number(type), id);
  }

  return (
    <div className={styles.files}>
      <div className={styles.nav}>
        <Navigation />
        <Tooltip title="查询" placement="left">
          <SearchOutlined />
        </Tooltip>
      </div>
      {loading ? <Spin spinning={loading} tip="正在加载资源目录" /> : null}
      <Dropdown trigger={["contextMenu"]} menu={{ items, onClick: onMenu }}>
        <div
          className={styles.layout}
          onDoubleClick={onDoubleClick}
          onContextMenu={stopPropagation}
        >
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
