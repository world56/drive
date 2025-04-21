import {
  IsInt,
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { RemarkDTO, PrimaryKeyStringDTO } from './common.dto';

import { ENUM_COMMON } from '@/enum/common';

export class UserDTO extends IntersectionType(RemarkDTO, PrimaryKeyStringDTO) {
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
    description: '登陆密码',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
    maxLength: 15,
    description: '用户名称',
  })
  @MaxLength(15, { message: '用户名称不得超过15位' })
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
    description: '角色类型',
    default: ENUM_COMMON.ROLE.REG,
  })
  @IsOptional()
  @IsEnum(ENUM_COMMON.ROLE)
  @IsInt()
  @Type(() => Number)
  role?: ENUM_COMMON.ROLE;

  @ApiProperty({
    maxLength: 100,
    description: '联系方式（邮箱、电话均可）',
  })
  @IsOptional()
  @MaxLength(100)
  @IsString()
  contact?: string;
}
