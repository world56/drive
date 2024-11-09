import Expand from "./Expand";
import { useRequest } from "ahooks";
import { getLogs } from "@/api/log";
import { toTime } from "@/utils/format";
import { getAllUsers } from "@/api/user";
import PagedQuery from "@/components/PagedQuery";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Select, Table } from "antd";
import { useInput, usePageTurning, useWindowSize } from "@/hooks";

import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_LOG } from "@/constant/log";

import type { TypeLog } from "@/interface/log";
import type { TypeUser } from "@/interface/user";

/**
 * @name Log 系统日志
 */
const Log = () => {
  const userEvent = useInput<TypeUser.DTO["id"]>();
  const logEvent = useInput<TypeLog.DTO["event"]>();

  const { height } = useWindowSize();

  const pagination = usePageTurning();
  const { currentPage, pageSize } = pagination;

  const { data, loading, run } = useRequest(
    () => getLogs({ pageSize, currentPage, event: logEvent.value }),
    { refreshDeps: [currentPage, pageSize] },
  );

  const { data: users } = useRequest(getAllUsers);

  const columns = [
    {
      title: "日志类型",
      width: 200,
      dataIndex: "event",
      render: (key: TypeLog.DTO["event"]) => CONSTANT_LOG.EVENT.OBJ[key]?.name,
    },
    { title: "操作人", width: 200, dataIndex: ["operator", "name"] },
    { title: "操作时间", width: 200, dataIndex: "createTime", render: toTime },
    { title: "快照", dataIndex: "desc", ellipsis: true },
  ];

  pagination.total = data?.count;

  return (
    <>
      <PagedQuery
        onClick={run}
        head={
          <>
            <span>日志类型：</span>
            <Select
              allowClear
              {...logEvent}
              placeholder="请选择状态状态"
              options={CONSTANT_LOG.EVENT.LIST}
              fieldNames={{ value: "id", label: "name" }}
            />

            <span>操作用户：</span>
            <Select
              allowClear
              {...userEvent}
              options={users}
              placeholder="请选择状态状态"
              fieldNames={{ value: "id", label: "name" }}
            />
          </>
        }
        button={
          <Popconfirm title="确认清空全部日志？">
            <Button danger icon={<DeleteOutlined />}>
              清空日志
            </Button>
          </Popconfirm>
        }
      >
        <Table
          columns={columns}
          loading={loading}
          pagination={pagination}
          dataSource={data?.list}
          rowKey={DB_PRIMARY_KEY}
          scroll={{ y: height - 285 }}
          expandable={{
            expandedRowRender: (row) => <Expand>{row.desc}</Expand>,
          }}
        />
      </PagedQuery>
    </>
  );
};

export default Log;
