import { isEmpty } from "@/utils";
import { Descriptions } from "antd";
import { filesize } from "filesize";
import { useReqDetails } from "@/hooks";
import { toTime } from "@/utils/format";
import { Drawer } from "@/components/Layout";
import { getResourceDetails } from "@/api/resource";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

export interface TypeAttributesProps {
  /** @param id 查询资源的ID */
  id?: TypeResource.DTO["id"];
  /** @param onClose 关闭弹窗 */
  onClose(): void;
}

const { Item } = Descriptions;

/**
 * @name Attributes 资源属性
 * @description 包活“文件”、“文件夹”详情
 */
const Attributes: React.FC<TypeAttributesProps> = ({ id, onClose }) => {
  const { loading, value } = useReqDetails(async () => {
    return getResourceDetails({ id: id! });
  }, [id]);

  const isFolder = value?.type === ENUM_RESOURCE.TYPE.FOLDER;
  const name = isFolder ? "文件夹" : "文件";

  return (
    <Drawer
      width={520}
      onClose={onClose}
      open={Boolean(id)}
      spinning={loading}
      title={`${name}详情`}
    >
      <Descriptions layout="vertical" size="middle">
        <Item span={3} label={`${name}名称`}>
          {value?.name}
        </Item>

        {isFolder ? null : (
          <Item span={3} label="后缀">
            {value?.suffix}
          </Item>
        )}

        <Item span={3} label="类型">
          {isEmpty(value?.type)
            ? "-"
            : CONSTANT_RESOURCE.TYPE.OBJ[value!.type]?.name}
        </Item>

        {isFolder ? (
          <Item span={3} label="资源数量">
            {value?.size || 0} 个
          </Item>
        ) : (
          <Item span={3} label="大小">
            {value?.size ? filesize(value?.size).toString() : 0}
          </Item>
        )}

        {isFolder ? null : (
          <Item span={3} label="下载次数">
            125 次
          </Item>
        )}

        <Item span={3} label='路径'>
          主目录{value?.paths?.length ? " / " : ""}
          {value?.paths?.map((v) => v.name).join(" / ")}
        </Item>

        <Item span={3} label={isFolder ? "创建时间" : "上传时间"}>
          {toTime(value?.createTime)}
        </Item>

        <Item span={3} label={isFolder ? "创建人" : "上传人"}>
          {value?.creatorId}
        </Item>

        <Item span={3} label="备注">
          {value?.remark || "无"}
        </Item>
      </Descriptions>
    </Drawer>
  );
};

export default Attributes;
