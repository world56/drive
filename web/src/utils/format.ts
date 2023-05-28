import dayjs from "dayjs";

import type { TypeCommon } from "@/interface/common";

export interface TypeListToTree
  extends Pick<TypeCommon.DTO, "id" | "name">,
    Partial<Pick<TypeCommon.DTO, "parentId">> {}


/**
 * @name listToTree 转换成树结构
 * @param list 一维数组
 * @param parentId 父ID 默认void
 * @param obj 会生成Key Value
 * @returns 
 */
export function listToTree<T extends TypeListToTree>(
  list: T[] = [],
  parentId?: string | undefined,
  obj: TypeCommon.GenericObject<T> = {},
): {
  list: (T & { children?: T[] })[];
  obj: TypeCommon.GenericObject<T>;
} {
  list.forEach((o) => (obj[o.id] = o));
  const format = list
    .filter((v) => (parentId ? v.parentId === parentId : !obj[v.parentId!]))
    .map((o) => ({ ...obj[o.id], children: listToTree(list, o.id).list }));
  return { list: format, obj };
}

/**
 * @name toCategory 转换成字典类目结构
 */
export function toCategory<
  T extends Pick<TypeCommon.DTO<number | string>, "id" | "name"> = Pick<
    TypeCommon.DTO<number | string>,
    "id" | "name"
  >,
>(LIST: T[]) {
  return { LIST, OBJ: Object.fromEntries(LIST.map((v) => [v.id, v])) };
}

/**
 * @name toTime 转换时间格式
 * @param timestamp 时间戳
 * @returns YYYY-MM-DD HH:mm:ss
 */
export function toTime(timestamp?: number | Date | string): string {
  return timestamp ? dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss") : "-";
}
