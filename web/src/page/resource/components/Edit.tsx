import {
  createFolder,
  updateResource,
  getResourceDetails,
} from "@/api/resource";
import { isEmpty } from "@/utils";
import FolderSelect from "./FolderSelect";
import { Form, Input, message } from "antd";
import { Modal } from "@/components/Layout";
import { FormHideKey } from "@/components/Form";
import { useCallback, useEffect, useState } from "react";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeCommon } from "@/interface/common";
import type { TypeResource } from "@/interface/resource";

export interface TypeEditResourceProps
  extends Partial<Pick<TypeResource.DTO, "id" | "parentId">> {
  /** @param open 开启、关闭 Modal */
  open: boolean;
  /** @name onClose 关闭弹窗后的回调 */
  onClose(): void;
}

const rules = [{ required: true }];

/**
 * @name Edit 编辑、创建资源
 */
const Edit: React.FC<TypeEditResourceProps> = ({
  id,
  open,
  onClose,
  parentId,
}) => {
  const [type, setType] = useState<ENUM_RESOURCE.TYPE>();

  const [load, setLoad] = useState(false);
  const [form] = Form.useForm<TypeResource.DTO>();

  async function onSubmit() {
    const values = await form.validateFields();
    if (id) await updateResource(values);
    else await createFolder(values);
    message.success("操作成功");
    onCancel();
  }

  function onCancel() {
    setType(undefined);
    form.resetFields();
    onClose();
  }

  const initialize = useCallback(
    async (id: TypeCommon.PrimaryKey) => {
      try {
        setLoad(true);
        const data = await getResourceDetails({ id: id! });
        setType(data.type);
        form.setFieldsValue(data);
        setLoad(false);
      } catch (e) {
        setLoad(false);
      }
    },
    [form],
  );

  useEffect(() => {
    id && initialize(id);
  }, [id, initialize]);

  useEffect(() => {
    !isEmpty(parentId) && form.setFieldsValue({ parentId });
  }, [parentId, form]);

  const isFolder = isEmpty(type) || type === ENUM_RESOURCE.TYPE.FOLDER;

  return (
    <Modal
      forceRender
      loading={load}
      onOk={onSubmit}
      onCancel={onCancel}
      open={Boolean(id || parentId || open)}
      title={`${id ? "编辑" : "创建"}${isFolder ? "文件夹" : "文件"}`}
    >
      <Form form={form} layout="vertical">
        <FormHideKey />

        <Form.Item name="parentId" label="所属目录">
          <FolderSelect disabledId={[id!]} />
        </Form.Item>

        <Form.Item name="name" label="名称" rules={rules}>
          <Input placeholder="请输入文件夹名称" allowClear />
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="请输入备注" rows={3} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
