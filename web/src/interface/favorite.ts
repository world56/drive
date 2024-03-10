import { ENUM_COMMON } from "@/enum/common";
import { ENUM_RESOURCE } from "@/enum/resource";

import type { TypeResource } from "./resource";

/**
 * @name TypeFavorite 收藏
 */
export namespace TypeFavorite {
  export interface DTO extends TypeResource.DTO {}

  /**
   * @name ReqFavorites 查询收藏类表
   */
  export interface ReqFavorites
    extends Partial<Pick<TypeFavorite.DTO, "name">> {
    /** @param 资源类型 */
    type: ENUM_RESOURCE.TYPE[];
    /** @param createTime 收藏时间排序方式 */
    createTime: ENUM_COMMON.SORT;
  }

  /**
   * @name Insert 收藏文件
   */
  export interface Insert {
    /** @param ids 资源ID */
    ids: Array<TypeResource.DTO["id"]>;
  }

  /**
   * @name Remove 移除收藏
   */
  export interface Remove extends Insert {}
}
