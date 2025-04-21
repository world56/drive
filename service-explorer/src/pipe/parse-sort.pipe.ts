import { Injectable } from '@nestjs/common';

import { ENUM_COMMON } from '@/enum/common';

import type { PipeTransform } from '@nestjs/common';

/**
 * @name ParseSortPipe 排序字段转小写
 * @description Prisma要求小写sort
 */
@Injectable()
export class ParseSortPipe<T extends ENUM_COMMON.SORT = ENUM_COMMON.SORT>
  implements PipeTransform
{
  private field: string;

  private SORTS = Object.values(ENUM_COMMON.SORT);

  public constructor(field: string = 'sort') {
    this.field = field;
  }

  transform(value: Record<string, T | Lowercase<T>>) {
    const val = value?.[this.field];
    if (this.SORTS.includes(val as T)) {
      value[this.field] = value[this.field].toLocaleLowerCase() as Lowercase<T>;
    }
    return value;
  }
}
