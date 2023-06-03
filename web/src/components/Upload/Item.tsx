import { memo } from "react";
import { ICON } from "./utils";
import styles from "./index.module.sass";
import { ReloadOutlined, FolderOutlined } from "@ant-design/icons";

import type { ListChildComponentProps } from "react-window";

interface TypeItemProps {
  // url: string;
}

/**
 * @name Item 资源状态
 */
const Item: React.FC<ListChildComponentProps<TypeItemProps>> = ({ style }) => {
  return (
    <div className={styles.item} style={style}>
      <img src={ICON.IMG} alt="#" />
      <div>
        <p>OmniConverter全能转换</p>
        <p>
          <span>上传中</span>
          &nbsp;
          <span>98%</span>
        </p>
      </div>
      <div className={styles.btn}>
        <FolderOutlined />
        <ReloadOutlined />
      </div>
    </div>
  );
};

export default memo(Item);
