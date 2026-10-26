import { API_PROXY_STORAGE_URL } from "@/config/request";
import ResourceIcon from "./Icon";
import styles from "./index.module.sass";

import type { TypeResource } from "@/interface/resource";

/**
 * @name ResourceName 资源名称
 * @description Table 可用，Icon、Name结合
 */
const ResourceName: React.FC<
  Pick<TypeResource.DTO, "suffix" | "type" | "fullName" | "size" | "objectName">
> = (props) => (
  <div className={styles.icon}>
    <ResourceIcon width={30} height={30} {...props} path={`${API_PROXY_STORAGE_URL}${props.objectName}`} />
    <span>{props.fullName}</span>
  </div>
);

export default ResourceName;
