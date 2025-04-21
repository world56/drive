import Edit from "./Edit";
import { useState } from "react";
import { useRequest } from "ahooks";
import { toTime } from "@/utils/format";
import Password from "@/components/Password";
import PagedQuery from "@/components/PagedQuery";
import { Button, Input, Select, Table } from "antd";
import { changeUserStatus, getUsers } from "@/api/user";
import { StatusBtn, StatusText } from "@/components/Status";
import { useInput, usePageTurning, useWindowSize } from "@/hooks";

import { DB_PRIMARY_KEY } from "@/config/db";
import { CONSTANT_USER } from "@/constant/user";
import { CONSTANT_COMMON } from "@/constant/common";

import type { TypeEditUserProps } from "./Edit";
import type { TypeUser } from "@/interface/user";
import type { ColumnsType } from "antd/es/table";
import type { TypeResetPasswordProps } from "@/components/Password";

/**
 * @name User 用户管理
 */
const User = () => {
  const name = useInput<string>();
  const account = useInput<string>();
  const status = useInput<TypeUser.DTO["status"]>();

  const [editUserPwdId, setUserPwdId] =
    useState<TypeResetPasswordProps["id"]>();
  const [editId, setEditId] = useState<TypeEditUserProps["id"]>();

  const { height } = useWindowSize();

  const pagination = usePageTurning();
  const { currentPage, pageSize } = pagination;

  const { data, loading, run } = useRequest(
    () =>
      getUsers({
        pageSize,
        currentPage,
        name: name.value,
        status: status.value,
        account: account.value,
      }),
    { refreshDeps: [pageSize, currentPage] },
  );

  const columns: ColumnsType<TypeUser.DTO> = [
    { title: "用户名称", dataIndex: "name" },
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
      <PagedQuery
        onClick={run}
        head={
          <>
            <span>用户名称：</span>
            <Input {...name} allowClear placeholder="输入用户名称查询" />

            <span>登录账号：</span>
            <Input {...account} allowClear placeholder="输入用户名称查询" />

            <span>状态：</span>
            <Select
              allowClear
              {...status}
              placeholder="请选择状态状态"
              options={CONSTANT_COMMON.STATUS.LIST}
              fieldNames={{ value: "id", label: "name" }}
            />
          </>
        }
        button={<Edit id={editId} onClose={onEdit} />}
      >
        <Table
          columns={columns}
          loading={loading}
          pagination={pagination}
          dataSource={data?.list}
          rowKey={DB_PRIMARY_KEY}
          scroll={{ y: height - 285 }}
        />
        <Password id={editUserPwdId} onClose={onResetPWD} />
      </PagedQuery>
    </>
  );
};

export default User;
