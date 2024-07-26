import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class RecycleCheckDTO {
  @ApiProperty({
    required: true,
    type: [Number],
    isArray: true,
    description: '需要检查的ID',
  })
  @Transform(({ value }) => value.split(',').map(Number), { toClassOnly: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
