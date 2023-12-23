import {
  IsInt,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PrimaryKeyStringDTO } from './common.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';

export class ResourceDTO extends PrimaryKeyStringDTO {
  @ApiProperty({
    required: true,
    minLength: 30,
    type: String,
    description: '资源名称',
  })
  @MaxLength(30, {
    message: '名称最多不超过30个字符',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '资源归属ID',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: '资源路径',
  })
  @IsOptional()
  @IsString()
  path: string;

  @ApiProperty({
    description: '资源大小、数量',
  })
  @IsOptional()
  @IsNumber()
  size: number;

  @ApiProperty({
    description: '资源类型',
  })
  @IsOptional()
  @IsEnum(ENUM_RESOURCE.TYPE)
  @Type(() => Number)
  @IsInt()
  type: ENUM_RESOURCE.TYPE;

  @ApiProperty({
    description: '资源后缀',
  })
  @IsString()
  @IsOptional()
  suffix: string;

  @ApiProperty({
    description: '资源备注',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  remark?: string;
}
