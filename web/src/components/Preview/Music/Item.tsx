import styles from "./index.module.sass";
import { DeleteOutlined } from "@ant-design/icons";

/**
 * @name Item 音乐标签
 */
const Item = () => {
  return (
    <div className={styles.item}>
      <div>
        <div>
          <p>不能说的秘密</p>
        </div>
        <div>
          <DeleteOutlined />
        </div>
      </div>
    </div>
  );
};

export default Item;
