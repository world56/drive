import styles from "./index.module.sass";
import ResourceIcon from "../Resource/Icon";
import { EnterOutlined } from "@ant-design/icons";
// import { relativeTime, toTime } from "@/utils/format";

import type { TypeResource } from "@/interface/resource";
import type { ListChildComponentProps } from "react-window";

interface TypeItemProps extends ListChildComponentProps<TypeResource.DTO[]> {}

/**
 * @name Item 资源
 */
const Item: React.FC<TypeItemProps> = ({ index, style, data }) => {
  const row = data[index];
  return (
    <div
      style={style}
      data-id={row.id}
      data-path={row.path}
      className={styles.item}
      data-suffix={row.suffix}
      data-parent-id={row.parentId}
      data-full-name={row.fullName}
    >
      <ResourceIcon width={40} {...row} />
      <div className={styles.detail}>
        <p className={styles.name}>{row.fullName}</p>
        <p
          title="点击打开目录"
          className={styles.path}
          data-full-name={row.fullName}
          data-dir-path={row.parentId || "/"}
        >
          {row?.paths?.length ? "主目录/" : "主目录"}
          {row?.paths?.map((v) => v.name).join("/")}
        </p>
      </div>
      <div className={styles.tools}>
        <EnterOutlined />
      </div>
    </div>
  );
};

export default Item;
