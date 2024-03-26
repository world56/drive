import { encryption } from "@/utils";
import { useReqDetails } from "@/hooks";
import styles from "./index.module.sass";
import { Modal } from "@/components/Layout";
import { useEffect, useState } from "react";
import { FormHideKey } from "@/components/Form";
import { Button, Form, Input, Switch } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import PwdForm from "@/components/Password/PwdForm";
import { getUser, insertUser, updateUser } from "@/api/user";

import { ENUM_COMMON } from "@/enum/common";

import type { TypeUser } from "@/interface/user";

const RULES_DEFAULT = [
  { required: true },
  {
    pattern: /^[a-zA-Z0-9_.@]+$/,
    message: "仅持字母、数字、下划线、点、@符号",
  },
];

export interface TypeEditUserProps {
  /**
   * @param id 用户ID
   * @description 有ID代表编辑 无ID为新增
   */
  id?: TypeUser.DTO["id"];
  /**
   * @name onClose 关闭弹窗后的回调
   */
  onClose(): void;
}
/**
 * @name Edit 新增、编辑用户
 */
const Edit: React.FC<TypeEditUserProps> = ({ id, onClose }) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm<TypeUser.DTO & { pwd: string }>();

  const { loading } = useReqDetails(async () => {
    const data = await getUser({ id: id! });
    form.setFieldsValue(data);
    return data;
  }, [id]);

  function onOpen() {
    setOpen(true);
  }

  async function onSubmit() {
    const { pwd, ...values } = await form.validateFields();
    if (id) {
      await updateUser(values);
    } else {
      values.password = await encryption(values.password);
      await insertUser(values);
    }
    onCancel();
  }

  function onCancel() {
    setOpen(false);
    form.resetFields();
    onClose();
  }

  useEffect(() => {
    id && setOpen(true);
  }, [id]);

  return (
    <>
      <Button onClick={onOpen} icon={<UserAddOutlined />} type="primary">
        新增用户
      </Button>
      <Modal
        open={open}
        onOk={onSubmit}
        spinning={loading}
        onCancel={onCancel}
        className={styles.edit}
        title={`${id ? "编辑" : "新增"}用户`}
      >
        <Form form={form} labelCol={{ span: 4, offset: 0 }}>
          <FormHideKey name="id" />

          <Form.Item
            label="登录账号"
            name="account"
            rules={[{ min: 5, max: 20 }, ...RULES_DEFAULT]}
          >
            <Input
              allowClear
              disabled={Boolean(id)}
              placeholder="请输入用户登录账号"
            />
          </Form.Item>

          <PwdForm form={form} id={id} />

          <Form.Item
            label="用户名称"
            name="name"
            rules={[
              { required: true },
              { min: 2, max: 15 },
              {
                pattern: /^[a-zA-Z0-9_.@\u4e00-\u9fa5]+$/,
                message: "仅持汉字、字母、数字、下划线、点、@符号",
              },
            ]}
          >
            <Input placeholder="请输入用户名称" allowClear />
          </Form.Item>

          <Form.Item
            name="contact"
            label="联系方式"
            rules={[{ max: 100, message: "最多不超过100位字符" }]}
          >
            <Input placeholder="请输入用户联系方式（邮箱、电话）" allowClear />
          </Form.Item>

          <Form.Item
            name="status"
            label="账号状态"
            valuePropName="checked"
            initialValue={ENUM_COMMON.STATUS.ACTIVATE}
          >
            <Switch />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea
              allowClear
              autoSize={{ minRows: 3 }}
              placeholder="请输入账号备注信息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;
