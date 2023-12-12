import styles from "./index.module.sass";
import { CheckOutlined } from "@ant-design/icons";

interface TypeChooseProps {
  /** @param selected 选中状态 */
  selected?: boolean;
  /** @param 名称 */
  name?: React.ReactNode;
}

/**
 * @name Choose 单选 ✅
 */
const Choose: React.FC<TypeChooseProps> = ({ name, selected }) => {
  return (
    <div className={styles.choose}>
      {selected ? (
        <CheckOutlined style={{ marginRight: 10 }} />
      ) : (
        <span style={{ marginRight: 25 }} />
      )}
      <span>{name}</span>
    </div>
  );
};

export default Choose;