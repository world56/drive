import { ENUM_COMMON } from "@/enum/common";
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
    size: number;
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
    creator?: Pick<TypeUser.DTO, "id" | "name">;
    /** @param count 下载次数 */
    count: number;
    /** @param favorite 收藏 */
    favorite: ENUM_RESOURCE.FAVORITE;
  }

  /**
   * @name ReqResources 查询资源列表
   * @param type 排序类型
   * @param order 排序方式
   */
  export interface ReqResources
    extends Partial<Pick<DTO, "id">>,
      Record<"order" | "type", string> {}

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
  export interface ReqGlobalResources extends Partial<Pick<DTO, "name">> {
    /** @param startTime 开始时间 */
    startTime?: number;
    /** @param endTime 结束时间 */
    endTime?: number;
    /** @param type 资源类型 */
    type: Array<TypeResource.DTO["type"]>;
    /** @param sort 排序方式 */
    sort: ENUM_COMMON.SORT;
  }
}
