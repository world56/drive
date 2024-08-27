import { Table } from "antd";
import Container from "./Container";

import type { TableProps } from "antd";

const columns: TableProps["columns"] = [
  {
    title: "操作类型",
    dataIndex: "type",
  },
];

/**
 * @name History 最近查阅资源
 */
const History = () => {
  return (
    <Container
      margin="0"
      height={300}
      title="最近查阅资源"
      width="calc(100% - 386px)"
    >
      <Table columns={columns} pagination={false} />
    </Container>
  );
};

export default History;
