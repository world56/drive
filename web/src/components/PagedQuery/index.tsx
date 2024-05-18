import { Card, Button } from "antd";
import styles from "./index.module.sass";
import { SearchOutlined } from "@ant-design/icons";

interface TypePagedQueryProps
  extends Partial<Record<"head" | "children" | "button", React.ReactNode>> {
  /**
   * @name onClick 店家查询
   */
  onClick(): void;
}

/**
 * @name PagedQuery 分页查询
 * @description 分页查询都走这个布局
 */
const PagedQuery: React.FC<TypePagedQueryProps> = ({
  head,
  button,
  onClick,
  children,
}) => (
  <div className={styles.layout}>
    <Card>
      {head}
      <Button onClick={onClick} type="primary" icon={<SearchOutlined />}>
        查询
      </Button>
      {button}
    </Card>
    {children}
  </div>
);

export default PagedQuery;
