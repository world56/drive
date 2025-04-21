import { Transform } from 'class-transformer';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Length, IsEnum, IsArray, IsString, IsOptional } from 'class-validator';

import { ResourceDTO } from '@/dto/resource.dto';

import { ENUM_COMMON } from '@/enum/common';
import { ENUM_RESOURCE } from '@/enum/explorer';

export class FindResourcesAllDTO extends PartialType(
  PickType(ResourceDTO, ['name'] as const),
) {
  @ApiProperty({
    type: Number,
    isArray: true,
    enum: ENUM_RESOURCE.TYPE,
    description: '资源类型',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ENUM_RESOURCE.TYPE, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  type: ENUM_RESOURCE.TYPE[];

  @ApiProperty({
    type: String,
    required: true,
    enum: ENUM_COMMON.SORT,
    description: '排序方式',
  })
  @IsString()
  @IsEnum(ENUM_COMMON.SORT)
  sort: Lowercase<ENUM_COMMON.SORT>;

  @ApiProperty({
    type: String,
    required: true,
    description: '创建人',
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  creators?: string[];

  @ApiProperty({
    type: Date,
    maxLength: 13,
    minLength: 13,
    description: '开始时间（13位时间戳）',
  })
  @IsOptional()
  @Length(13)
  @IsString()
  startTime?: Date;

  @ApiProperty({
    type: Date,
    maxLength: 13,
    minLength: 13,
    description: '结束（13位时间戳）',
  })
  @IsOptional()
  @Length(13)
  @IsString()
  endTime?: Date;
}
