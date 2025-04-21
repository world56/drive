import styles from "./index.module.sass";
import { DeleteOutlined } from "@ant-design/icons";

import type { TypeResource } from "@/interface/resource";

interface TypeItemProps extends Pick<TypeResource.DTO, "id" | "name"> {}

/**
 * @name Item 音乐标签
 */
const Item: React.FC<TypeItemProps> = ({ id, name }) => {
  return (
    <div data-id={id} className={styles.item}>
      <p>{name}</p>
      <DeleteOutlined />
    </div>
  );
};
``;
export default Item;
