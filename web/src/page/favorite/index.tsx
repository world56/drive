import { Table } from "antd";
import { useRequest } from "ahooks";
import { getFavorites } from "@/api/favorite";

import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

const columns = [
  { title: "资源名称", dataIndex: "name" },
  {
    title: "文件类型",
    dataIndex: "type",
    render: (type: TypeResource.DTO["type"]) =>
      CONSTANT_RESOURCE.TYPE.OBJ[type].name,
  },
  { title: "创建时间", dataIndex: "createTime" },
  { title: "大小", dataIndex: "size" },
];

/**
 * @name Favorite 收藏列表
 */
const Favorite = () => {
  const { data, loading } = useRequest(getFavorites);

  return (
    <Table
      loading={loading}
      columns={columns}
      rowKey={DB_PRIMARY_KEY}
      dataSource={data?.list}
    />
  );
};

export default Favorite;
