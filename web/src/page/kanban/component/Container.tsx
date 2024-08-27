import styles from "./index.module.sass";

interface TypeContainerProps
  extends Partial<Record<"width" | "height" | "margin", number | string>> {
  /** @param title 标题 */
  title?: string;
  children?: React.ReactNode;
}

/**
 * @name Container 容器
 */
const Container: React.FC<TypeContainerProps> = ({
  title,
  height,
  width,
  margin,
  children,
}) => (
  <div style={{ width, height, margin }} className={styles.container}>
    {title ? <h3>{title}</h3> : null}
    {children}
  </div>
);

export default Container;
