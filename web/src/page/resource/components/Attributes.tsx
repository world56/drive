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
  const { loading, value } = useReqDetails(
    () => getResourceDetails({ id: id! }),
    [id],
  );

  const IS_FOLDER = value?.type === ENUM_RESOURCE.TYPE.FOLDER;

  return (
    <Drawer
      width={520}
      onClose={onClose}
      open={Boolean(id)}
      spinning={loading}
      styles={{ body: { padding: 16 } }}
      title={`${IS_FOLDER ? "文件夹" : "文件"}详情`}
    >
      <Descriptions layout="vertical" size="middle">
        <Item span={3} label="名称">
          {value?.name}
        </Item>

        {IS_FOLDER ? null : (
          <Item span={3} label="后缀">
            {value?.suffix}
          </Item>
        )}

        <Item span={3} label="类型">
          {isEmpty(value?.type)
            ? "未知"
            : CONSTANT_RESOURCE.TYPE.OBJ[value!.type]?.name}
        </Item>

        {IS_FOLDER ? (
          <Item span={3} label="资源数量">
            {value?.size || 0} 个
          </Item>
        ) : (
          <Item span={3} label="大小">
            {value?.size ? filesize(value?.size).toString() : 0}
          </Item>
        )}

        {IS_FOLDER ? null : (
          <Item span={3} label="下载次数">
            {value?.count || 0} 次
          </Item>
        )}

        <Item span={3} label="路径">
          主目录{value?.paths?.length ? " / " : ""}
          {value?.paths?.map((v) => v.name).join(" / ")}
        </Item>

        <Item span={3} label={IS_FOLDER ? "创建时间" : "上传时间"}>
          {toTime(value?.createTime)}
        </Item>

        <Item span={3} label={IS_FOLDER ? "创建人" : "上传人"}>
          {value?.creator?.name || "-"}
        </Item>

        <Item span={3} label="备注">
          {value?.remark || "无"}
        </Item>
      </Descriptions>
    </Drawer>
  );
};

export default Attributes;
