import { ENUM_RESOURCE } from "@/enum/resource";

/**
 * @name TypeStats 看板统计
 */
export namespace TypeStats {
  /**
   * @name Storage 系统存储占比
   */
  export interface Storage {
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
  export interface Access
    extends Array<{
      /** @param date 日期 */
      date: string;
      /** @param value 使用数量 */
      value: number;
    }> {}
}
