import Container from './Container';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';

import { FORM_ACCOUNT_RULES, FORM_PASSWORD_RULES } from '@/config/antd';

const Login = () => {

  const [form] = Form.useForm();

  const navigate = useNavigate();

  async function onSubmit() {
    const values = await form.validateFields();
    console.log('@-values', values);
    navigate('/');
  };

  return (
    <Container>
      <Form form={form} name='drive'>
        <Form.Item name='account' rules={FORM_ACCOUNT_RULES}>
          <Input onPressEnter={onSubmit} placeholder='Account' allowClear />
        </Form.Item>
        <Form.Item name='password' rules={FORM_PASSWORD_RULES}>
          <Input.Password onPressEnter={onSubmit} placeholder='Password' allowClear />
        </Form.Item>
        <Form.Item valuePropName='checked' name='expire'>
          <Checkbox>Remember me.</Checkbox>
        </Form.Item>
        <Button onClick={onSubmit} type='primary'>Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
