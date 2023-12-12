import {
  EyeOutlined,
  CopyOutlined,
  FormOutlined,
  DragOutlined,
  HomeOutlined,
  SyncOutlined,
  HeartOutlined,
  DeleteOutlined,
  SearchOutlined,
  FolderOutlined,
  FileAddOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  CloudDownloadOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import styles from "./index.module.sass";
import Choose from "@/components/Choose";
import { useStore, useToFolder } from "@/hooks";
import { useMemo, useRef, useState } from "react";
import { Dropdown, Spin, Breadcrumb } from "antd";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { MenuProps, SpinProps } from "antd";
import type { TypeResource } from "@/interface/resource";

export interface TypeFilesContainerProps {
  children?: React.ReactNode;
  /** @param loading 加载效果 */
  loading: SpinProps["spinning"];
  /**
   * @name onMenu 容器-菜单事件
   * @description 鼠标右键点击文件列表容器菜单
   */
  onMenu(type: ENUM_RESOURCE.MENU_CONTAINER, id?: string): void;
  /**
   * @name onItemMenu 资源列表-菜单事件
   * @description 鼠标右键点击资源菜单
   */
  onItemMenu(
    type: ENUM_RESOURCE.MENU_RESOURCE,
    param: TypeSelectResource,
  ): void;
}

const MENU_PREVIEW_RESOURCE = {
  icon: <EyeOutlined />,
  label: "预览",
  key: ENUM_RESOURCE.MENU_RESOURCE.OPEN,
};

const MENU_PREVIEW_FOLDER = {
  icon: <FolderOpenOutlined />,
  label: "打开",
  key: ENUM_RESOURCE.MENU_RESOURCE.OPEN,
};

const MENU_FILE: MenuProps["items"] = [
  {
    icon: <HeartOutlined />,
    label: "收藏",
    key: ENUM_RESOURCE.MENU_RESOURCE.COLLECT,
  },
  {
    icon: <CopyOutlined />,
    label: "复制名称",
    key: ENUM_RESOURCE.MENU_RESOURCE.COPY_NAME,
  },
  { type: "divider" },
  {
    icon: <FormOutlined />,
    label: "编辑信息",
    key: ENUM_RESOURCE.MENU_RESOURCE.EDIT,
  },
  {
    icon: <DragOutlined />,
    label: "移动至",
    key: ENUM_RESOURCE.MENU_RESOURCE.MOVE,
  },
  {
    icon: <CloudDownloadOutlined />,
    label: "下载文件",
    key: ENUM_RESOURCE.MENU_RESOURCE.DOWNLOAD,
  },
  { type: "divider" },
  {
    icon: <DeleteOutlined className="red" />,
    label: <span className="red">删除</span>,
    key: ENUM_RESOURCE.MENU_RESOURCE.DELETE,
  },
  {
    icon: <FileTextOutlined />,
    label: "属性",
    key: ENUM_RESOURCE.MENU_RESOURCE.ATTRIBUTES,
  },
];

type TypeSelectResource = Required<Pick<TypeResource.DTO, "id" | "fullName">>;

/**
 * @name Container 文件列表容器
 * @description 抽离非核心UI、功能
 */
const Container: React.FC<TypeFilesContainerProps> = ({
  onMenu,
  loading,
  children,
  onItemMenu,
}) => {
  const toFolder = useToFolder();
  const resource = useStore("resource");

  const item = useRef<TypeSelectResource>(null!);

  const [items, setMenus] = useState<MenuProps["items"]>([]);

  const { path, sort, foldersObj } = resource;

  const MENU_CONTAINER: MenuProps["items"] = [
    {
      icon: <FileAddOutlined />,
      label: "上传文件",
      key: ENUM_RESOURCE.MENU_CONTAINER.UPLOAD_FILE,
    },
    {
      icon: <FolderAddOutlined />,
      label: "上传文件夹",
      key: ENUM_RESOURCE.MENU_CONTAINER.UPLOAD_FOLDER,
    },
    { type: "divider" },
    {
      icon: <FolderOutlined />,
      label: "新建文件夹",
      key: ENUM_RESOURCE.MENU_CONTAINER.MKDIR,
    },
    { type: "divider" },
    {
      icon: <SortDescendingOutlined />,
      label: "排序",
      key: "3",
      children: [
        {
          label: (
            <Choose
              name="时间"
              key={sort.type}
              selected={
                sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATE_TIME
              }
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATE_TIME,
        },
        {
          label: (
            <Choose
              name="名称"
              key={sort.type}
              selected={sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_NAME}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_NAME,
        },
        {
          label: (
            <Choose
              name="大小"
              key={sort.type}
              selected={sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_SIZE}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_SIZE,
        },
        {
          label: (
            <Choose
              name="格式"
              selected={sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_SUFFIX}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_SUFFIX,
        },
        {
          label: (
            <Choose
              name="类型"
              selected={sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_TYPE}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_TYPE,
        },
        {
          label: (
            <Choose
              name="创建人"
              selected={
                sort.type === ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATOR_ID
              }
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_CREATOR_ID,
        },
        { type: "divider" },
        {
          label: (
            <Choose
              name="降序"
              selected={sort.order === ENUM_RESOURCE.MENU_CONTAINER.SORT_DESC}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_DESC,
        },
        {
          label: (
            <Choose
              name="升序"
              selected={sort.order === ENUM_RESOURCE.MENU_CONTAINER.SORT_ASC}
            />
          ),
          key: ENUM_RESOURCE.MENU_CONTAINER.SORT_ASC,
        },
      ],
    },
    { type: "divider" },
    {
      icon: <SearchOutlined />,
      label: "搜索",
      key: ENUM_RESOURCE.MENU_CONTAINER.SEARCH,
    },
    {
      icon: <SyncOutlined />,
      label: "刷新",
      key: ENUM_RESOURCE.MENU_CONTAINER.REFRESH,
    },
  ];

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

  const onClick: MenuProps["onClick"] = (e) => {
    if (item.current?.id) {
      onItemMenu(e.key as ENUM_RESOURCE.MENU_RESOURCE, item.current);
    } else {
      onMenu(e.key as ENUM_RESOURCE.MENU_CONTAINER, resource.path.at(-1));
    }
  };

  function onMenuOpen(e: React.MouseEvent<HTMLDivElement>) {
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("div");
    if (ele?.dataset?.id) {
      const { id, fullName } = ele.dataset as TypeSelectResource;
      const IS_FOLDER = Number(ele.dataset.type) === ENUM_RESOURCE.TYPE.FOLDER;
      setMenus([
        IS_FOLDER ? MENU_PREVIEW_FOLDER : MENU_PREVIEW_RESOURCE,
        ...MENU_FILE!,
      ]);
      item.current = { id, fullName };
    } else {
      item.current = null!;
      setMenus(MENU_CONTAINER);
    }
  }

  return (
    <div className={styles.files} onContextMenu={onMenuOpen}>
      <Breadcrumb items={route} className={styles.nav} />
      {loading ? <Spin spinning={loading} /> : null}
      <Dropdown trigger={["contextMenu"]} menu={{ onClick, items }}>
        <div className={styles.layout}>{children}</div>
      </Dropdown>
    </div>
  );
};

export default Container;
