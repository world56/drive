import PwdForm from "./PwdForm";
import { encryption } from "@/utils";
import { FormHideKey } from "../Form";
import { Form, Input, Modal } from "antd";
import { updatePassword } from "@/api/user";

import type { TypeUser } from "@/interface/user";

const RULES_DEFAULT = [
  { required: true },
  {
    pattern: /^[a-zA-Z0-9_.@]+$/,
    message: "仅持字母、数字、下划线、点、@符号",
  },
];

export interface TypeResetPasswordProps
  extends Partial<Pick<TypeUser.DTO, "id">> {
  /** @name onClose 关闭窗口 */
  onClose(): void;
}

/**
 * @name Password 修改密码
 */
const Password: React.FC<TypeResetPasswordProps> = ({ id, onClose }) => {
  const [form] = Form.useForm<TypeUser.ChangePWD>();

  async function onSubmit() {
    const values = await form.validateFields();
    const data = await encryption(values);
    await updatePassword(data);
    onCancel();
  }

  function onCancel() {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      onOk={onSubmit}
      title="修改登录密码"
      open={Boolean(id)}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4, offset: 0 }}>
        <FormHideKey initialValue={id} />
        <Form.Item
          name="pwd"
          label="旧密码"
          rules={[{ min: 6, max: 20 }, ...RULES_DEFAULT]}
        >
          <Input.Password
            allowClear
            visibilityToggle={false}
            placeholder="请输入旧的登录密码"
          />
        </Form.Item>
        <PwdForm form={form} change />
      </Form>
    </Modal>
  );
};

export default Password;
