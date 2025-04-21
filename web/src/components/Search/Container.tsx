import { Spin } from "antd";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { insertHotSearch } from "@/api/stats";
import { useActions, useStore } from "@/hooks";

import type { TypeResource } from "@/interface/resource";

interface TypeSearchContainerProps {
  /**
   * @param onSelect 点击的文件
   */
  onSelect(val: TypeResource.DTO): void;
  /**
   * @name onPath 跳转至对应目录
   */
  onPath(parentId?: string): void;
  /**
   * @parma loading 加载动画
   */
  loading: boolean;
  children?: React.ReactNode;
}

/**
 * @name Container 全局搜索
 */
const Container: React.FC<TypeSearchContainerProps> = ({
  onPath,
  loading,
  onSelect,
  children,
}) => {
  const actions = useActions();

  const { SEARCH } = useStore("config");

  async function onClick(e?: React.MouseEvent<HTMLDivElement>) {
    stopPropagation(e);
    const click = e?.target as HTMLElement;
    const path = click.closest("[data-dir-path]") as HTMLElement;
    if (path) {
      insertHistory(path?.dataset?.fullName!);
      onPath(path?.dataset?.dirPath);
    }
  }

  function onDoubleClick(e?: React.MouseEvent<HTMLDivElement>) {
    stopPropagation(e);
    const click = e?.target as HTMLElement;
    const target = click.closest("[data-id]") as HTMLElement;
    if (target?.dataset?.id) {
      const { id, suffix, path, parentId, fullName } = target?.dataset || {};
      insertHistory(fullName!);
      return onSelect({
        id,
        path,
        suffix,
        parentId,
        fullName,
      } as TypeResource.DTO);
    }
  }

  function insertHistory(name: string) {
    insertHotSearch({ name });
  }

  function onCloseSearch() {
    actions.setConfig({ SEARCH: false });
  }

  return (
    <div
      onClick={onCloseSearch}
      className={styles.layout}
      style={{ display: SEARCH ? "block" : "none" }}
    >
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={styles.search}
      >
        {children}
        {loading ? <Spin tip="正在查询" /> : null}
      </div>
    </div>
  );
};

export default Container;
