import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecycleUpdateDTO {
  @ApiProperty({
    required: true,
    type: [Number],
    isArray: true,
    description: '回收操作ID',
  })
  @IsInt({ each: true })
  ids: number[];
}
