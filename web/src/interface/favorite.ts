import { TypeResource } from "./resource";

/**
 * @name TypeFavorite 收藏
 */
export namespace TypeFavorite {
  export interface DTO extends TypeResource.DTO {}

  /**
   * @name ReqFavorites 查询收藏类表
   */
  export interface ReqFavorites {}

  /**
   * @name Insert 收藏文件
   */
  export interface Insert {
    /** @param resourceId 资源ID */
    resourceId: TypeResource.DTO["id"];
  }

  /**
   * @name Remove 移除收藏
   */
  export interface Remove extends Insert {}
}
