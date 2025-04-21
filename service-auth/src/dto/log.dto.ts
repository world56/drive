import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

import { ENUM_LOG } from '@/enum/log';

/**
 * @name LogDTO 日志
 */
export class LogDTO {
  @ApiProperty({
    description: '主键ID',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: '操作人',
  })
  @IsString()
  operatorId: string;

  @ApiProperty({
    description: '事件类型',
  })
  @IsString()
  @IsEnum(ENUM_LOG.EVENT)
  event: ENUM_LOG.EVENT;
}
