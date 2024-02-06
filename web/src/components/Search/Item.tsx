import { toTime } from "@/utils/format";
import styles from "./index.module.sass";
import ResourceIcon from "../ResourceIcon";
import { EnterOutlined } from "@ant-design/icons";

import type { TypeResource } from "@/interface/resource";
import type { ListChildComponentProps } from "react-window";

interface TypeItemProps extends ListChildComponentProps<TypeResource.DTO[]> {}

/**
 * @name Item 资源
 */
const Item: React.FC<TypeItemProps> = ({ index, style, data }) => {
  const row = data[index];
  return (
    <div className={styles.item} style={style}>
      <ResourceIcon width={40} {...row} />
      <div className={styles.detail}>
        <p className={styles.name}>{row.fullName}</p>
        <p className={styles.path}>
          路径/路径/路径/路径/路径/路径/路径/路径/路径/路径/路径/路径
        </p>
        <p className={styles.time}>{toTime(row?.createTime)}</p>
      </div>
      <div className={styles.tools}>
        <EnterOutlined />
      </div>
    </div>
  );
};

export default Item;
