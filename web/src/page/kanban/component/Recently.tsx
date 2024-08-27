import { Table } from "antd";
import Container from "./Container";
import styles from "./index.module.sass";

import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TableProps } from "antd";
import type { TypeRecycle } from "@/interface/recycle";

const columns: TableProps["columns"] = [
  {
    title: "资源名称",
    dataIndex: "name",
  },
  {
    width: 200,
    title: "资源类型",
    dataIndex: ["resource", "type"],
    render: (type: TypeRecycle.DTO["resource"]["type"]) =>
      CONSTANT_RESOURCE.TYPE.OBJ[type]?.name,
  },
];

/**
 * @name Recently 最近上传、收藏
 */
const Recently = () => {
  return (
    <div className={styles.recently}>
      <Container title="近期上传">
        <Table
          columns={columns}
          pagination={false}
          scroll={{ y: 476.5 }}
          dataSource={[]}
        />
      </Container>
      <Container title="收藏排行">
        <Table
          dataSource={[]}
          columns={columns}
          pagination={false}
          scroll={{ y: 476.5 }}
        />
      </Container>
    </div>
  );
};

export default Recently;
