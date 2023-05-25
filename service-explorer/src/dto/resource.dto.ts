import {
  IsInt,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrimaryKeyStringDTO } from './common.dto';

import { ENUM_EXPLORER } from 'src/enum/explorer';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceDTO extends PrimaryKeyStringDTO {
  @ApiProperty({
    required: true,
    minLength: 30,
    type: String,
    description: '登陆账号',
  })
  @MaxLength(30, {
    message: '名称最多不超过30个字符',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '父ID',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  path: string;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsEnum(ENUM_EXPLORER.TYPE)
  @Type(() => Number)
  @IsInt()
  type: ENUM_EXPLORER.TYPE;

  @IsString()
  @IsOptional()
  suffix: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  remark?: string;
}
