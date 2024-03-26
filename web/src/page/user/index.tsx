import Edit from "./Edit";
import { useState } from "react";
import { useRequest } from "ahooks";
import { toTime } from "@/utils/format";
import styles from "./index.module.sass";
import Password from "@/components/Password";
import { Button, Card, Input, Table } from "antd";
import { useInput, usePageTurning } from "@/hooks";
import { changeUserStatus, getUsers } from "@/api/user";
import { StatusBtn, StatusText } from "@/components/Status";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_USER } from "@/constant/user";

import type { TypeEditUserProps } from "./Edit";
import type { TypeUser } from "@/interface/user";
import type { ColumnsType } from "antd/es/table";
import type { TypeResetPasswordProps } from "@/components/Password";

/**
 * @name User 用户管理
 */
const User = () => {
  const name = useInput();

  const [editUserPwdId, setUserPwdId] =
    useState<TypeResetPasswordProps["id"]>();
  const [editId, setEditId] = useState<TypeEditUserProps["id"]>();

  const pagination = usePageTurning();
  const { currentPage, pageSize } = pagination;

  const { data, loading, run } = useRequest(() =>
    getUsers({ pageSize, currentPage, name: name.value }),
  );

  const columns: ColumnsType<TypeUser.DTO> = [
    { title: "名称", dataIndex: "name" },
    { title: "登陆账号", dataIndex: "account" },
    {
      title: "角色类型",
      dataIndex: "role",
      render: (role: TypeUser.DTO["role"]) =>
        CONSTANT_USER.ROLE.OBJ[role]?.name,
    },
    {
      title: "账号状态",
      dataIndex: "status",
      render: (status: TypeUser.DTO["status"]) => <StatusText type={status} />,
    },
    { title: "注册时间", dataIndex: "createTime", width: 200, render: toTime },
    {
      width: 240,
      title: "操作",
      align: "center",
      key: DB_PRIMARY_KEY,
      render: (row: TypeUser.DTO) => (
        <>
          <Button onClick={() => onResetPWD(row)} type="link" size="small">
            修改密码
          </Button>
          <StatusBtn type={row.status} onClick={() => changeStatus(row)} />
          <Button onClick={() => onEdit(row)} type="link" size="small">
            编辑
          </Button>
        </>
      ),
    },
  ];

  function onEdit(row?: TypeUser.DTO) {
    setEditId(row?.id);
    row || setEditId(undefined) || run();
  }

  async function changeStatus(row: TypeUser.DTO) {
    await changeUserStatus({ id: row.id });
    run();
  }

  function onResetPWD(row?: TypeUser.DTO) {
    setUserPwdId(row?.id);
  }

  pagination.total = data?.count;

  return (
    <>
      <Card title="用户列表" className={styles.layout}>
        <div className={styles.search}>
          <Input
            {...name}
            allowClear
            prefix={<UserOutlined />}
            placeholder="输入用户名称查询"
          />
          <Button onClick={run} icon={<SearchOutlined />}>
            查询
          </Button>
          <Edit id={editId} onClose={onEdit} />
        </div>

        <Table
          columns={columns}
          loading={loading}
          pagination={pagination}
          dataSource={data?.list}
          rowKey={DB_PRIMARY_KEY}
        />
        <Password id={editUserPwdId} onClose={onResetPWD} />
      </Card>
    </>
  );
};

export default User;
