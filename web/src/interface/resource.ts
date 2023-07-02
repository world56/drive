import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeUser } from "./user";
import type { TypeCommon } from "./common";

/**
 * @name TypeResource 资源管理
 */
export namespace TypeResource {
  /**
   * @name DTO 资源DTO
   */
  export interface DTO
    extends Pick<TypeCommon.DTO, "id" | "name">,
      Partial<Pick<TypeCommon.DTO, "parentId">> {
    /** @param size 资源大小 */
    size?: number;
    /** @param path 预览路径  */
    path?: string;
    /** @param suffix 格式 */
    suffix: string;
    /** @param createTime 初始化创建、上传时间 */
    createTime: Date;
    /** @param type 资源类型 */
    type: ENUM_RESOURCE.TYPE;
    /** @param fullName 资源全称 */
    fullName: string;
    /** @param 备注 */
    remark?: string;
    /** @param paths 资源目录路径ID */
    paths?: Array<Pick<DTO, "id" | "name">>;
    /** @param creatorId 创建、上传人 */
    creatorId: TypeUser.DTO["id"];
    /** @param creator 创建、上传人详情 */
    creator?: TypeUser.DTO;
  }

  /**
   * @name ReqResources 查询资源列表
   */
  export interface ReqResources extends Partial<Pick<DTO, "id">> {}

  /**
   * @name ResResourceList 资源列表
   */
  export interface ResResourceList extends Record<"folders" | "files", DTO[]> {}

  /**
   * @name ReqMoveResources 移动资源
   */
  export interface ReqMoveResources extends Pick<DTO, "parentId"> {
    /**
     * @param ids 资源的ID
     * @description 传递的是数组ID ['1', '2', '3']
     */
    ids: Array<DTO["id"]>;
  }

  /**
   * @name ReqDeleteResources 删除资源
   * @description 删除相对谨慎，如果是文件夹并存在子级，则不能删除
   */
  export interface ReqDeleteResources extends Pick<ReqMoveResources, "ids"> {}

  /**
   * @name ReqGlobalExplorer 模糊查询所有资源
   */
  export interface ReqGlobalResources
    extends Partial<Pick<DTO, "name" | "type">> {}
}
