import Radio from "./Radio";
import styles from "./index.module.sass";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";

/**
 * @name Input 搜索查询
 */
const Input = () => {
  return (
    <>
      <div className={styles.input}>
        <div className={styles.icon}>
          <SearchOutlined />
        </div>
        <input placeholder="请输入关键字进行查询" />
        <div className={styles.icon}>
          <MoreOutlined />
        </div>
      </div>
      <div className={styles.filter}>
        <Radio />
      </div>
    </>
  );
};

export default Input;
