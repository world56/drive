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

type TypeFolderPath = Pick<TypeListToTree, "id" | "name">;

/**
 * @name fillFolderPaths 给文件夹字典补上路径
 * @description 文件夹列表入库时算一次，之后各处直接读 folder.paths
 */
export function fillFolderPaths<
  T extends TypeListToTree & { paths?: TypeFolderPath[] },
>(foldersObj: TypeCommon.GenericObject<T> = {}) {
  const cache = new Set<string>();

  function fill(id?: string): TypeFolderPath[] {
    if (!id) return [];

    const folder = foldersObj[id];
    if (!folder) return [];
    if (cache.has(id)) return folder.paths || [];

    cache.add(id);
    folder.paths = [...fill(folder.parentId), { id: folder.id, name: folder.name }];
    return folder.paths;
  }

  Object.keys(foldersObj).forEach((id) => fill(id));
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

/**
 * @name relativeTime 获取发生时间的最近时间段
 * @param timestamp 时间戳
 */
export function relativeTime(timestamp: Date | number) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - new Date(timestamp).valueOf();
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  if (elapsedTime < minute) {
    return "刚刚";
  } else if (elapsedTime < hour) {
    const minutesAgo = Math.floor(elapsedTime / minute);
    return minutesAgo + "分钟前";
  } else if (elapsedTime < day) {
    const hoursAgo = Math.floor(elapsedTime / hour);
    return hoursAgo + "小时前";
  } else if (elapsedTime < week) {
    const daysAgo = Math.floor(elapsedTime / day);
    return daysAgo + "天前";
  } else if (elapsedTime < month) {
    const weeksAgo = Math.floor(elapsedTime / week);
    return weeksAgo + "周前";
  } else if (elapsedTime < year) {
    const monthsAgo = Math.floor(elapsedTime / month);
    return monthsAgo + "个月前";
  } else {
    const yearsAgo = Math.floor(elapsedTime / year);
    return yearsAgo + "年前";
  }
}

/**
 * @name toTimestamp 转换时间格式
 * @param date 例：2023-07-15T06:27:34.715Z
 * @returns 时间戳
 */
export function toTimestamp(date: string | Date) {
  return new Date(date).valueOf();
}

/**
 * @name toFixed 保留数字后两位小数
 * @param number 原数据
 * @param fixed 位数
 * @description 不会四舍五入
 */
export function toFixed(number: number, fixed: number) {
  return ~~(Math.pow(10, fixed) * number) / Math.pow(10, fixed);
}
