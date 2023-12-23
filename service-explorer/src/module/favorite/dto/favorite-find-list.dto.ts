import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

import { ResourceDTO } from '@/dto/resource.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';
import { ENUM_COMMON } from '@/enum/common';

export class FavoriteFindListDTO extends PartialType(
  PickType(ResourceDTO, ['name'] as const),
) {
  @ApiProperty({
    required: true,
    type: Array,
    description: '资源类型',
    enum: ENUM_RESOURCE.TYPE, // 添加 enum 属性
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? [Number(value)] : value.map(Number),
  )
  @IsEnum(ENUM_RESOURCE.TYPE, { each: true })
  type: ENUM_RESOURCE.TYPE[];

  @ApiProperty({
    required: true,
    type: String,
    description: '资源类型',
    enum: ENUM_COMMON.SORT,
  })
  @IsEnum(ENUM_COMMON.SORT)
  createTime: ENUM_COMMON.SORT;
}
