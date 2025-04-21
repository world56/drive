import { ENUM_RESOURCE } from "@/enum/resource";
import { TypeResource } from "./resource";

/**
 * @name TypeStats 看板统计
 */
export namespace TypeStats {
  /**
   * @name Storage 系统存储占比
   */
  export interface ResStorage {
    /** @param free 已使用 */
    used: number;
    /** @param free 剩余可用 */
    free: number;
    /** @param total 空间大小 */
    total: number;
    /** @param storage 各种类型统计 */
    storage: Record<ENUM_RESOURCE.TYPE, number>;
  }

  /**
   * @name Access 访问趋势
   */
  export interface ResAccess
    extends Array<{
      /** @param date 日期 */
      date: string;
      /** @param value 使用数量 */
      value: number;
    }> {}

  /**
   * @name Hot 热门查询
   */
  export interface ReqHot {
    /** @param name 字眼 */
    name: string;
  }

  /**
   * @name ResHot 热门查询趋势
   */
  export interface ResHot
    extends Array<{
      /** @param name 字眼 */
      name: string;
      /** @param value 使用数量 */
      value: number;
    }> {}

  /**
   * @name ResRecently 最近上传资源
   */
  export interface ResRecently
    extends Pick<TypeResource.DTO, "id" | "fullName" | "type" | "path"> {}

  /**
   * @name ResFavorite 收藏数排行
   */
  export interface ResFavorite extends ResRecently {
    /** @param count 总数 */
    count: number;
  }
}
