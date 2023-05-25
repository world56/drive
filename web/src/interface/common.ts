
export namespace TypeCommon {

  export type PrimaryKey = string;

  export interface DTO<T = PrimaryKey> {
    /** @param id 主键ID */
    id: T;
    /** @param parentId 父ID */
    parentId: T;
    /** @param name 名称 */
    name: string;
  }

  /**
   * @name PageTurning 翻页参数
   * @param currentPage 当前页码
   * @param pageSize 每页数量
   */
  export type PageTurning = Record<"currentPage" | "pageSize", number>;

  export interface Response<T> extends PageTurning {
    list: T[];
    /** @param count 总数量 */
    readonly count: number;
  }

}
