import { useEffect } from "react";
import { useRequest } from "ahooks";
import Container from "./Container";
import { encryption } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useStore, useActions } from "@/hooks";
import { Button, Checkbox, Form, Input } from "antd";
import { getSuperStatus, register } from "@/api/auth";

import { FORM_ACCOUNT_RULES, FORM_PASSWORD_RULES } from "@/config/antd";

import type { TypeUser } from "@/interface/user";

const Login = () => {
  const actions = useActions();
  const user = useStore("user");

  const navigate = useNavigate();

  const [form] = Form.useForm<TypeUser.Login>();

  const { data: bol, loading } = useRequest(getSuperStatus);

  async function onSubmit() {
    const values = await form.validateFields();
    if (!bol) {
      const text = await encryption(values);
      await register(text);
    }
    actions.login(values);
  }

  useEffect(() => {
    user.id && navigate("/");
  }, [user, navigate]);

  return (
    <Container>
      <Form form={form} name="drive">
        <Form.Item name="account" rules={FORM_ACCOUNT_RULES}>
          <Input onPressEnter={onSubmit} placeholder="Account" allowClear />
        </Form.Item>
        <Form.Item name="password" rules={FORM_PASSWORD_RULES}>
          <Input.Password
            allowClear
            placeholder="Password"
            onPressEnter={onSubmit}
          />
        </Form.Item>
        <Form.Item valuePropName="checked" name="expire">
          <Checkbox>Remember me.</Checkbox>
        </Form.Item>
        <Button type="primary" onClick={onSubmit} loading={loading}>
          {bol ? "Login" : "Register Administrator"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
