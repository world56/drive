import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  NotAcceptableException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';

/**
 * @name ValidationDTOPipe 单个校验DTO
 * @description 若需要对数据先进行其他处理 则不能使用全局校验Pipe，该Pipe是手动挡
 */
@Injectable()
export class ValidationDTOPipe implements PipeTransform {
  public constructor(private readonly DTO: ClassConstructor<object>) {
    this.DTO = DTO;
  }

  public async transform(value: object, metadata: ArgumentMetadata) {
    const errors = await validate(plainToClass(this.DTO, value));
    if (errors.length) {
      throw new NotAcceptableException(
        errors
          .map((v) => Object.values(v.constraints))
          .flat()
          .join('，'),
      );
    }
    return value;
  }
}
