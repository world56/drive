import {
  EyeOutlined,
  HeartTwoTone,
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
import { Dropdown, Spin, Breadcrumb, message } from "antd";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { MenuProps, SpinProps } from "antd";
import type { TypeResource } from "@/interface/resource";

export interface TypeFilesContainerProps {
  children?: React.ReactNode;
  /** @param loading 加载效果 */
  loading: SpinProps["spinning"];
  /**
   * @name onMenu 菜单事件
   * @description 鼠标右键触发的选项菜单
   */
  onMenu(type: ENUM_RESOURCE.MENU, id?: string): void;
}

const MENU_PREVIEW_RESOURCE = {
  icon: <EyeOutlined />,
  label: "预览",
  key: ENUM_RESOURCE.MENU.OPEN,
};

const MENU_PREVIEW_FOLDER = {
  icon: <FolderOpenOutlined />,
  label: "打开",
  key: ENUM_RESOURCE.MENU.OPEN,
};

const MENU_PREVIEW_ATTRIBUTE = {
  icon: <FileTextOutlined />,
  label: "属性",
  key: ENUM_RESOURCE.MENU.ATTRIBUTES,
};

const MENU_FAVORITE_DISABLE = {
  icon: <HeartOutlined />,
  label: "取消收藏",
  key: ENUM_RESOURCE.MENU.FAVORITE_DISABLE,
};

const MENU_FAVORITE_ENABLE = {
  icon: <HeartTwoTone twoToneColor="#FF0000" />,
  label: "收藏",
  key: ENUM_RESOURCE.MENU.FAVORITE_ENABLE,
};

const MENU_FILE: MenuProps["items"] = [
  {
    icon: <CopyOutlined />,
    label: "复制名称",
    key: ENUM_RESOURCE.MENU.COPY_NAME,
  },
  { type: "divider" },
  {
    icon: <FormOutlined />,
    label: "编辑信息",
    key: ENUM_RESOURCE.MENU.EDIT,
  },
  {
    icon: <DragOutlined />,
    label: "移动至",
    key: ENUM_RESOURCE.MENU.MOVE,
  },
  {
    icon: <CloudDownloadOutlined />,
    label: "下载文件",
    key: ENUM_RESOURCE.MENU.DOWNLOAD,
  },
  { type: "divider" },
  {
    icon: <DeleteOutlined className="red" />,
    label: <span className="red">删除</span>,
    key: ENUM_RESOURCE.MENU.DELETE,
  },
  MENU_PREVIEW_ATTRIBUTE,
];

type TypeSelectResource = Required<
  Pick<TypeResource.DTO, "id" | "fullName"> & {
    favorite: "0" | "1";
  }
>;

/**
 * @name Container 文件列表容器
 * @description 抽离非核心UI、功能
 */
const Container: React.FC<TypeFilesContainerProps> = ({
  onMenu,
  loading,
  children,
}) => {
  const toFolder = useToFolder();
  const resource = useStore("resource");

  const item = useRef<TypeSelectResource>(null!);

  const [items, setMenus] = useState<MenuProps["items"]>([]);

  const { path, sort, foldersObj } = resource;
  const folderId = resource.path.at(-1);

  const MENU_CONTAINER: MenuProps["items"] = [
    {
      icon: <FileAddOutlined />,
      label: "上传文件",
      key: ENUM_RESOURCE.MENU.UPLOAD_FILE,
    },
    {
      icon: <FolderAddOutlined />,
      label: "上传文件夹",
      key: ENUM_RESOURCE.MENU.UPLOAD_FOLDER,
    },
    { type: "divider" },
    {
      icon: <FolderOutlined />,
      label: "新建文件夹",
      key: ENUM_RESOURCE.MENU.MKDIR,
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
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_CREATE_TIME}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_CREATE_TIME,
        },
        {
          label: (
            <Choose
              name="名称"
              key={sort.type}
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_NAME}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_NAME,
        },
        {
          label: (
            <Choose
              name="大小"
              key={sort.type}
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_SIZE}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_SIZE,
        },
        {
          label: (
            <Choose
              name="格式"
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_SUFFIX}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_SUFFIX,
        },
        {
          label: (
            <Choose
              name="类型"
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_TYPE}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_TYPE,
        },
        {
          label: (
            <Choose
              name="创建人"
              selected={sort.type === ENUM_RESOURCE.MENU.SORT_CREATOR_ID}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_CREATOR_ID,
        },
        { type: "divider" },
        {
          label: (
            <Choose
              name="降序"
              selected={sort.order === ENUM_RESOURCE.MENU.SORT_DESC}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_DESC,
        },
        {
          label: (
            <Choose
              name="升序"
              selected={sort.order === ENUM_RESOURCE.MENU.SORT_ASC}
            />
          ),
          key: ENUM_RESOURCE.MENU.SORT_ASC,
        },
      ],
    },
    { type: "divider" },
    {
      icon: <SearchOutlined />,
      label: "搜索",
      key: ENUM_RESOURCE.MENU.SEARCH,
    },
    {
      icon: <SyncOutlined />,
      label: "刷新",
      key: ENUM_RESOURCE.MENU.REFRESH,
    },
    { type: "divider" },
    MENU_PREVIEW_ATTRIBUTE,
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
    if (e.key === ENUM_RESOURCE.MENU.COPY_NAME) {
      navigator.clipboard.writeText(item.current?.fullName);
      message.success("复制成功");
    } else {
      onMenu(e.key as ENUM_RESOURCE.MENU, item.current?.id || folderId);
    }
  };

  function onMenuOpen(e: React.MouseEvent<HTMLDivElement>) {
    const targetElement = e.target as HTMLElement;
    const ele = targetElement.closest("div");
    if (ele?.dataset?.id) {
      const { id, fullName, favorite } = ele.dataset as TypeSelectResource;
      const IS_FOLDER = Number(ele.dataset.type) === ENUM_RESOURCE.TYPE.FOLDER;
      const IS_FAVORITE = Number(favorite) === ENUM_RESOURCE.FAVORITE.ENABLE;
      const items = [
        IS_FOLDER ? MENU_PREVIEW_FOLDER : MENU_PREVIEW_RESOURCE,
        IS_FAVORITE ? MENU_FAVORITE_DISABLE : MENU_FAVORITE_ENABLE,
        ...MENU_FILE!,
      ];
      IS_FOLDER && items.splice(6, 1);
      item.current = { id, fullName, favorite };
      setMenus(items);
    } else {
      item.current = null!;
      folderId || MENU_CONTAINER!.splice(-2);
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
