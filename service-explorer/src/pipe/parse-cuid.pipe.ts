import { Injectable, BadRequestException } from '@nestjs/common';

import type { PipeTransform, ArgumentMetadata } from '@nestjs/common';

/**
 * @name ParseCUIDPipe 检查一个字符串是否为CUID
 * @see https://github.com/paralleldrive/cuid2/blob/main/src/index.js
 */
@Injectable()
export class ParseCUIDPipe implements PipeTransform {
  private readonly RULE_CUID = /^[0-9a-z]+$/;
  private readonly MIN_LENGTH = 2;
  private readonly MAX_LENGTH = 32;

  transform(value: string, metadata: ArgumentMetadata) {
    try {
      const length = value?.length;
      if (
        typeof value === 'string' &&
        length >= this.MIN_LENGTH &&
        length <= this.MAX_LENGTH &&
        this.RULE_CUID.test(value)
      )
        return value;
    } finally {
    }
    throw new BadRequestException('Not a valid CUID');
  }
}
