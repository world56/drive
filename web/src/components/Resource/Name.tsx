import ResourceIcon from "./Icon";
import styles from "./index.module.sass";

import type { TypeResource } from "@/interface/resource";

/**
 * @name ResourceName 资源名称
 * @description Table 可用，Icon、Name结合
 */
const ResourceName: React.FC<
  Pick<TypeResource.DTO, "suffix" | "type" | "fullName" | "size">
> = (props) => (
  <div className={styles.icon}>
    <ResourceIcon width={30} height={30} {...props} />
    <span>{props.fullName}</span>
  </div>
);

export default ResourceName;
