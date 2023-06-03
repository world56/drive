import { useState } from "react";
import styles from "./index.module.sass";
import { SyncOutlined, CloseOutlined, PauseOutlined } from "@ant-design/icons";

interface TypeUploadContainerProps {
  children?: React.ReactNode;
}

/**
 * @name Container 抽离非核心UI、功能
 * @description 进度
 */
const Container: React.FC<TypeUploadContainerProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  function onClick() {
    setOpen((b) => !b);
  }

  return (
    <div className={`${styles.layout} ${open ? styles.open : styles.close}`}>
      <div onClick={onClick} className={styles.header} title="点击打开、收起">
        <div className={styles.status}>
          <SyncOutlined className={styles.icon} />
          <span>正在上传</span>
          <span />
          <span>100%</span>
        </div>
        <div className={styles.btn}>
          <PauseOutlined />
          <CloseOutlined />
        </div>
      </div>
      {open ? children : null}
    </div>
  );
};

export default Container;
