import { Dropdown } from "antd";
import styles from "./index.module.sass";

interface TypeItemProps {
  icon: React.ReactNode;
  name: string;
  children: React.ReactNode;
}

/**
 * @name Item 筛选条件布局
 */
const Item: React.FC<TypeItemProps> = ({ icon, name, children }) => (
  <Dropdown
    overlayStyle={{ minWidth: "max-content" }}
    dropdownRender={() => <div className={styles.background}>{children}</div>}
  >
    <span className={styles.item}>
      {icon}
      {name}
    </span>
  </Dropdown>
);

export default Item;
