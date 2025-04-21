import { Injectable } from '@nestjs/common';

import type { PipeTransform } from '@nestjs/common';

interface TypeParseDatePipeValue extends Record<string, Date> {}

/**
 * @name ParseDatePipe 日期查询转换
 * @description 将时间戳（13位）转换为Date对象
 */
@Injectable()
export class ParseDatePipe implements PipeTransform {
  private fields: string[] = [];

  public constructor(fields: string[] = []) {
    this.fields = fields;
  }

  transform(value: TypeParseDatePipeValue) {
    this.fields.forEach((k) => {
      if (value[k]) {
        value[k] = new Date(Number(value[k]));
      }
    });
    return value;
  }
}
