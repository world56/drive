
export namespace TypeCommon {

  export type PrimaryKey = string;

  export interface DTO<T = PrimaryKey> {
    id: T;
    parentId: T;
    name: string;
  }

  export type PageTurning = Record<"currentPage" | "pageSize", number>;

  export interface Response<T> extends PageTurning {
    list: T[];
    readonly count: number;
  }

}
