import { Spin } from "antd";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { insertHotSearch } from "@/api/stats";
import { useActions, useStore, useToFolder } from "@/hooks";

interface TypeSearchContainerProps {
  /**
   * @param onSelect 点击的文件
   */
  onSelect(): void;
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
  loading,
  onSelect,
  children,
}) => {
  const actions = useActions();

  const toFolder = useToFolder();
  const { SEARCH } = useStore("config");

  async function onClick(e?: React.MouseEvent<HTMLDivElement>) {
    stopPropagation(e);
    const click = e?.target as HTMLElement;
    const target = click.closest("[data-id]") as HTMLElement;
    const { name } = target?.dataset || {};
    name && insertHotSearch({ name });
    const path = click.closest("[data-path]") as HTMLElement;
    if (path) {
      toFolder(path?.dataset?.path);
      return actions.setConfig({ SEARCH: false });
    }
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
      <div onClick={onClick} className={styles.search}>
        {children}
        {loading ? <Spin tip="正在查询" /> : null}
      </div>
    </div>
  );
};

export default Container;
