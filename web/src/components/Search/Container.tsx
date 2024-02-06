import styles from "./index.module.sass";
import { stopPropagation } from "@/utils";
import { useActions, useStore } from "@/hooks";

interface TypeSearchContainerProps {
  /** @param onSelect 点击的文件 */
  onSelect(): void;
  children?: React.ReactNode;
}

/**
 * @name Container 全局搜索
 */
const Container: React.FC<TypeSearchContainerProps> = ({
  onSelect,
  children,
}) => {
  const { SEARCH } = useStore("config");

  const actions = useActions();

  function onClick(e?: React.MouseEvent<HTMLElement>) {
    stopPropagation(e);
    onSelect();
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
      </div>
    </div>
  );
};

export default Container;
