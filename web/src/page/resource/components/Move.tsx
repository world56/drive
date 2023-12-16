import { useMemo } from "react";
import { useStore } from "@/hooks";
import FolderSelect from "./FolderSelect";
import { Form, message, Modal } from "antd";
import { moveResources } from "@/api/resource";

import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeResource } from "@/interface/resource";

export interface TypeMoveProps {
  /** @param ids 资源id列表 */
  ids: TypeResource.DTO["id"][];
  /** @name onClose 关闭"移动资源"弹窗 */
  onClose(): void;
}

/**
 * @name Move 资源移动目录
 */
const Move: React.FC<TypeMoveProps> = ({ ids, onClose }) => {
  const { foldersObj } = useStore("resource");
  const [form] = Form.useForm<TypeResource.ReqMoveResources>();

  async function onSubmit() {
    const values = await form.validateFields();
    values.ids = ids;
    await moveResources(values);
    onCancel();
  }

  function onCancel() {
    form.resetFields();
    onClose();
  }

  const folderIds = useMemo(
    () =>
      ids.filter((id) => foldersObj[id]?.type === ENUM_RESOURCE.TYPE.FOLDER),
    [ids, foldersObj],
  );

  return (
    <Modal
      onOk={onSubmit}
      title="移动资源位置"
      onCancel={onCancel}
      open={Boolean(ids.length)}
    >
      <Form form={form}>
        <Form.Item name="parentId">
          <FolderSelect disabledId={folderIds} />
        </Form.Item>
        <p>
          "文件夹"不能被移动到自身的文件夹中。若同时选择文件、文件夹进行操作，可能会同时受到限制。
        </p>
      </Form>
    </Modal>
  );
};

export default Move;
