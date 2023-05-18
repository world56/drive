import {
  IsInt,
  IsEnum,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PrimaryKeyStringDTO } from './common.dto';

import { ENUM_COMMON } from '@/enum/common';

export class UserDTO extends PrimaryKeyStringDTO {
  @ApiProperty({
    required: true,
    minLength: 5,
    type: String,
    description: '登陆账号',
  })
  @MinLength(5, { message: '账号长度不得少于5位' })
  @IsString()
  account: string;

  @ApiProperty({
    required: true,
    minLength: 5,
    description: '登陆密码',
  })
  @MinLength(5, { message: '密码长度不得少于5位' })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    description: '用户名称',
  })
  @MinLength(6, { message: '用户名称不得超过6位' })
  @IsString()
  name: string;

  @ApiProperty({
    name: '用户状态',
    required: true,
    default: ENUM_COMMON.STATUS.ACTIVATE,
    description: '用户状态',
  })
  @IsEnum(ENUM_COMMON.STATUS)
  @IsInt()
  @Type(() => Number)
  status: ENUM_COMMON.STATUS;

  @ApiProperty({
    description: '是否为超级管理员',
    default: ENUM_COMMON.SUPER_ADMIN.NOT_SUPER,
  })
  @IsOptional()
  @IsEnum(ENUM_COMMON.SUPER_ADMIN)
  @IsInt()
  @Type(() => Number)
  isSuper?: ENUM_COMMON.SUPER_ADMIN;
}
