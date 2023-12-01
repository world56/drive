import { Button, Form } from "antd";
import { getUser } from "@/api/user";
import { useReqDetails } from "@/hooks";
import { Modal } from "@/components/Layout";
import { useEffect, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";

import type { TypeUser } from "@/interface/user";

interface TypeEditUserProps {
  /**
   * @param id 用户ID
   * @description 有ID代表编辑 无ID为新增
   */
  id?: TypeUser.DTO["id"];

  /**
   * @name onClose 关闭弹窗后的回调
   */
  onClose():void;
}
/**
 * @name Edit 新增、编辑用户
 */
const Edit: React.FC<TypeEditUserProps> = ({ id }) => {
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm<TypeUser.DTO>();

  const { loading } = useReqDetails(async () => {
    const data = await getUser({ id: id! });
    form.setFieldsValue(data);
    return data;
  }, [id]);

  function onOpen() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
    form.resetFields();
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
        spinning={loading}
        onCancel={onClose}
        title={`${id ? "编辑" : "新增"}用户`}
      >
        <Form form={form}></Form>
      </Modal>
    </>
  );
};

export default Edit;
