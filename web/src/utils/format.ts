import dayjs from "dayjs";

import type { TypeCommon } from "@/interface/common";

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
