import { useStore } from "@/hooks";
import styles from "./index.module.sass";
import ResourceIcon from "../Resource/Icon";
import { EnterOutlined } from "@ant-design/icons";
// import { relativeTime, toTime } from "@/utils/format";

import { API_PROXY_STORAGE_URL } from "@/config/request";

import type { TypeResource } from "@/interface/resource";
import type { ListChildComponentProps } from "react-window";

interface TypeItemProps extends ListChildComponentProps<TypeResource.DTO[]> { }

/**
 * @name Item 资源
 */
const Item: React.FC<TypeItemProps> = ({ index, style, data }) => {
  const row = data[index];
  const { foldersObj } = useStore("resource");
  const paths = row.parentId ? foldersObj[row.parentId]?.paths : undefined;

  return (
    <div
      style={style}
      data-id={row.id}
      className={styles.item}
      data-suffix={row.suffix}
      data-parent-id={row.parentId}
      data-full-name={row.fullName}
      data-object-name={row.objectName}
    >
      <ResourceIcon width={40} {...row}
        path={`${API_PROXY_STORAGE_URL}${row.objectName}`}
      />
      <div className={styles.detail}>
        <p className={styles.name}>{row.fullName}</p>
        <p
          title="点击打开目录"
          className={styles.path}
          data-full-name={row.fullName}
          data-dir-path={row.parentId || "/"}
        >
          {paths?.length
            ? `主目录/${paths.map((v) => v.name).join("/")}`
            : "主目录"}
        </p>
      </div>
      <div className={styles.tools}>
        <EnterOutlined />
      </div>
    </div>
  );
};

export default Item;
