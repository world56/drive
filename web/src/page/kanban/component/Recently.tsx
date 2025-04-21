import { Table } from "antd";
import { useRequest } from "ahooks";
import Container from "./Container";
import styles from "./index.module.sass";
import { getFavoriteCount, getRecentResources } from "@/api/stats";

import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TableProps } from "antd";
import type { TypeRecycle } from "@/interface/recycle";

const columns: TableProps["columns"] = [
  {
    title: "资源名称",
    dataIndex: "fullName",
  },
  {
    width: 100,
    title: "资源类型",
    dataIndex: "type",
    align: "center",
    render: (type: TypeRecycle.DTO["resource"]["type"]) =>
      CONSTANT_RESOURCE.TYPE.OBJ[type]?.name,
  },
];

/**
 * @name Recently 最近上传、收藏
 */
const Recently = () => {
  const { data, loading } = useRequest(() =>
    Promise.all([getFavoriteCount(), getRecentResources()]),
  );

  return (
    <div className={styles.recently}>
      <Container title="近期上传、创建" loading={loading}>
        <Table
          columns={columns}
          pagination={false}
          scroll={{ y: 476.5 }}
          dataSource={data?.[1]}
          rowKey={DB_PRIMARY_KEY}
        />
      </Container>
      <Container title="收藏排行" loading={loading}>
        <Table
          columns={columns}
          pagination={false}
          scroll={{ y: 476.5 }}
          dataSource={data?.[0]}
          rowKey={DB_PRIMARY_KEY}
        />
      </Container>
    </div>
  );
};

export default Recently;
