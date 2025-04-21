import { Spin } from "antd";
import styles from "./index.module.sass";

interface TypeContainerProps
  extends Partial<Record<"width" | "height" | "margin", number | string>> {
  /** @param title 标题 */
  title?: string;
  loading?: boolean;
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
  loading = false,
}) => (
  <div style={{ width, height, margin }} className={styles.container}>
    <Spin spinning={loading}>
      <div>
        {title ? <h3>{title}</h3> : null}
        {children}
      </div>
    </Spin>
  </div>
);

export default Container;
