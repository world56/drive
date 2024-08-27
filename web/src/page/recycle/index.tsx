import { useRequest } from "ahooks";
import { toTime } from "@/utils/format";
import { SyncOutlined } from "@ant-design/icons";
import ResourceName from "@/components/Resource/Name";
import { Space, Table, FloatButton, Typography, Popconfirm } from "antd";
import { getRecycles, deleteRecycles, recoverRecycles } from "@/api/recycle";

// import { ENUM_COMMON } from "@/enum/common";
import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TableProps } from "antd";
import type { TypeRecycle } from "@/interface/recycle";

// function getAutoDeleteTime() {
//   const currentDate = new Date();
//   const futureDate = new Date(currentDate);
//   futureDate.setDate(currentDate.getDate() + 7);
//   futureDate.setHours(1, 0, 0, 0);
//   return futureDate.getTime();
// }

// const NOW = getAutoDeleteTime();
// const HOUR = 60 * 60 * 1000;
// const DAY = 24 * 60 * 60 * 1000;

/**
 * @name Recycle 回收站
 */
const Recycle = () => {
  const { data, run, loading } = useRequest(getRecycles);

  async function onDelete(row: TypeRecycle.DTO) {
    await deleteRecycles({ ids: [row.id] });
    run();
  }

  async function onRecover(row: TypeRecycle.DTO) {
    await recoverRecycles({ ids: [row.id] });
    run();
  }

  const columns: TableProps["columns"] = [
    {
      title: "资源名称",
      key: DB_PRIMARY_KEY,
      render: (row: TypeRecycle.DTO) => <ResourceName {...row.resource} />,
    },
    {
      width: 200,
      title: "资源类型",
      dataIndex: ["resource", "type"],
      render: (type: TypeRecycle.DTO["resource"]["type"]) =>
        CONSTANT_RESOURCE.TYPE.OBJ[type].name,
    },
    {
      width: 150,
      title: "操作人",
      dataIndex: ["operator", "name"],
    },
    {
      width: 200,
      title: "删除删除",
      dataIndex: "createTime",
      render: toTime,
    },
    // {
    //   width: 150,
    //   title: "离自动删除剩余",
    //   dataIndex: "createTime",
    //   render: (date: Date) => {
    //     const diff = NOW - new Date(date).valueOf();
    //     const day = Math.floor(diff / DAY);
    //     const hour = Math.floor((diff % DAY) / HOUR);
    //     return (
    //       <span style={{ color: day ? undefined : ENUM_COMMON.COLOR.RED }}>
    //         {day ? `${day}天 ` : ""}
    //         {hour}小时
    //       </span>
    //     );
    //   },
    // },
    {
      width: 180,
      title: "操作",
      align: "center",
      render: (row: TypeRecycle.DTO) => (
        <Space align="center">
          <Popconfirm
            title="警告"
            description="删除后不可恢复！"
            onConfirm={() => onDelete(row)}
          >
            <Typography.Link type="danger">立即删除</Typography.Link>
          </Popconfirm>
          <Typography.Link onClick={() => onRecover(row)}>
            恢复原处
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        pagination={false}
        rowKey={DB_PRIMARY_KEY}
      />
      <FloatButton
        type="primary"
        onClick={run}
        tooltip="刷新页面"
        icon={<SyncOutlined spin={loading} />}
      />
    </>
  );
};

export default Recycle;
