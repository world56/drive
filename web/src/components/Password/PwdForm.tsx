import { isEmpty } from "@/utils";
import { Form, Input } from "antd";

import type { FormInstance } from "antd";
import type { TypeUser } from "@/interface/user";
import type { ValidatorRule } from "rc-field-form/lib/interface";

const RULES_DEFAULT = [
  { required: true },
  {
    pattern: /^[a-zA-Z0-9_.@]+$/,
    message: "仅持字母、数字、下划线、点、@符号",
  },
];

interface TypePwdFormProps {
  id?: TypeUser.DTO["id"];
  /**
   * @param change 修改密码
   * @description 修改密码、注册用户初始化密码，password字段label不一样
   */
  change?: boolean;
  form: FormInstance<TypeUser.ChangePWD>;
}

/**
 * @name PwdForm 密码验证表单
 * @description 仅用作与“用户密码”相关操作
 */
const PwdForm: React.FC<TypePwdFormProps> = ({ id, form, change }) => {
  const onCheckPwd: ValidatorRule["validator"] = async (_r, value) => {
    const bol = isEmpty(value) || form.getFieldValue("password") === value;
    return bol ? true : Promise.reject("确认密码不一致，请重新确认");
  };

  function onRemakePwd() {
    form.setFieldValue("confirmPwd", undefined);
  }

  return (
    <>
      {id ? null : (
        <Form.Item
          name="password"
          label={`${change ? "新" : "登录"}密码`}
          rules={[{ min: 6, max: 20 }, ...RULES_DEFAULT]}
        >
          <Input.Password
            allowClear
            onChange={onRemakePwd}
            visibilityToggle={false}
            placeholder={`请输入用户${change ? "新" : ""}登录密码`}
          />
        </Form.Item>
      )}

      <Form.Item noStyle shouldUpdate>
        {() =>
          !form.getFieldValue("password") ||
          form.getFieldError("password").length ? null : (
            <Form.Item
              label="确认密码"
              name="confirmPwd"
              rules={[{ required: true }, { validator: onCheckPwd }]}
            >
              <Input.Password
                allowClear
                visibilityToggle={false}
                placeholder="请二次确认用户登录密码"
              />
            </Form.Item>
          )
        }
      </Form.Item>
    </>
  );
};

export default PwdForm;
