import {
  HeartFilled,
  DragOutlined,
  HeartOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import styles from "./index.module.sass";
import { getResources } from "@/api/resource";
import { useStore, useActions } from "@/hooks";
import { useDeferredValue, useMemo } from "react";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeFilesProps } from "../Files";
import type { TypeResource } from "@/interface/resource";

interface TypeMultipleChoicesProps extends Pick<TypeFilesProps, "onMenu"> {
  /** @total 当前目录资源 */
  data?: Awaited<ReturnType<typeof getResources>>;
}

/**
 * @name MultipleChoices 多选
 */
const MultipleChoices: React.FC<TypeMultipleChoicesProps> = ({
  onMenu,
  data = [],
}) => {
  const actions = useActions();
  const { selects } = useStore("resource");

  const obj = useMemo(() => {
    const length = data.length;
    const map: Record<TypeResource.DTO["id"], TypeResource.DTO> = {};
    for (let i = 0; i < length; i++) map[data[i].id] = data[i];
    return map;
  }, [data]);

  const selectKeys = Object.keys(selects);
  const selectAll = data?.length === selectKeys.length;

  const favorite = useMemo(
    () =>
      selectKeys.length
        ? selectKeys.filter(
            (id) => obj[id]?.favorite === ENUM_RESOURCE.FAVORITE.ENABLE,
          ).length === selectKeys.length
        : false,
    [selectKeys, obj],
  );


  function onSelect() {
    if (selectAll) return;
    actions.setSelect(Object.fromEntries(data.map((v) => [v.id, true])));
  }

  function onCancel() {
    actions.setSelect({});
  }

  function onDownload() {
    onMenu(
      ENUM_RESOURCE.MENU.DOWNLOAD,
      selectKeys.filter((id) => obj[id].type !== ENUM_RESOURCE.TYPE.FOLDER),
    );
  }

  function onFavorite() {
    onMenu(
      favorite
        ? ENUM_RESOURCE.MENU.FAVORITE_DISABLE
        : ENUM_RESOURCE.MENU.FAVORITE_ENABLE,
      selectKeys,
    );
  }

  const IS_FAVORITE = useDeferredValue(favorite);

  return (
    <div
      className={styles.selectMenu}
      style={{ bottom: selectKeys.length ? 57 : -50 }}
    >
      <Tooltip title={selectAll ? "已勾选全部资源" : "全选"}>
        <CheckSquareOutlined
          onClick={onSelect}
          style={{ color: selectAll ? "rgba(255,255,255,0.3)" : "" }}
        />
      </Tooltip>

      <Tooltip title="移动">
        <DragOutlined
          onClick={() => onMenu(ENUM_RESOURCE.MENU.MOVE, selectKeys)}
        />
      </Tooltip>

      <Tooltip title={IS_FAVORITE ? "取消收藏" : "收藏"}>
        {IS_FAVORITE ? (
          <HeartOutlined onClick={onFavorite} />
        ) : (
          <HeartFilled onClick={onFavorite} style={{ color: "#EA584A" }} />
        )}
      </Tooltip>

      <Tooltip title="下载">
        <CloudDownloadOutlined onClick={onDownload} />
      </Tooltip>

      <Tooltip title="删除">
        <DeleteOutlined
          onClick={() => onMenu(ENUM_RESOURCE.MENU.DELETE, selectKeys)}
        />
      </Tooltip>

      <Tooltip title="取消">
        <CloseCircleOutlined onClick={onCancel} />
      </Tooltip>
    </div>
  );
};

export default MultipleChoices;
