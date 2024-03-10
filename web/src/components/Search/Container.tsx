import { Spin } from "antd";
import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
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

  function onClick(e?: React.MouseEvent<HTMLDivElement>) {
    stopPropagation(e);
    const click = e?.target as HTMLElement;
    const eleFolder = click.closest("[data-path]") as HTMLElement;
    if (eleFolder) {
      toFolder(eleFolder?.dataset?.path);
      return actions.setConfig({ SEARCH: false });
    }
    // const elePreview = click.closest("[data-id]");
    // if (elePreview) {
    // onSelect();
    // }
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
