import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  /**
   * @name filterCUD 过滤出需要增加的
   * @param dto 用户传递的
   * @param db 数据库存在的
   * @description 数据库不存在的则新增
   */
  filterInsert<T extends string[] = string[]>(dto: T, db: T) {
    const dbMap = Object.fromEntries(db.map((id) => [id, true]));
    const length = dto.length;
    const insertId = [] as T;
    for (let i = 0; i < length; i++) {
      if (!dbMap[dto[i]]) {
        insertId.push(dto[i]);
      }
    }
    return insertId;
  }
}
