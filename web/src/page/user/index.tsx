import Edit from "./Edit";
import { useRequest } from "ahooks";
import { getUsers } from "@/api/user";
import styles from "./index.module.sass";
import { Button, Card, Input, Table } from "antd";
import { useInput, usePageTurning } from "@/hooks";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

import { DB_PRIMARY_KEY } from "@/config/db";

/**
 * @name User 用户管理
 */
const User = () => {
  const name = useInput();

  const pagination = usePageTurning();
  const { currentPage, pageSize } = pagination;

  const { data, loading, run } = useRequest(() =>
    getUsers({ pageSize, currentPage, name: name.value }),
  );

  const columns = [
    { title: "名称", dataIndex: "name" },
    { title: "登陆账号", dataIndex: "account" },
    { title: "角色类型", dataIndex: "role" },
    { title: "账号状态", dataIndex: "status" },
    { title: "注册时间", dataIndex: "createTime" },
    { title: "操作", key: DB_PRIMARY_KEY },
  ];

  pagination.total = data?.count;

  return (
    <>
      <Card title="用户列表" className={styles.layout}>
        <Input
          {...name}
          allowClear
          prefix={<UserOutlined />}
          placeholder="输入用户名称查询"
        />

        <Button onClick={run} icon={<SearchOutlined />}>
          查询
        </Button>

        <Edit onClose={run} />

        <Table
          columns={columns}
          loading={loading}
          pagination={pagination}
          dataSource={data?.list}
          rowKey={DB_PRIMARY_KEY}
        />
      </Card>
    </>
  );
};

export default User;
