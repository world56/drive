import {
  PickType,
  ApiProperty,
  PartialType,
  IntersectionType,
} from '@nestjs/swagger';
import { UserDTO } from '@/dto/user.dto';
import { PaginationDTO } from '@/dto/common.dto';
import { IsOptional, IsString } from 'class-validator';

export class UserListQueryDTO extends IntersectionType(
  PaginationDTO,
  PartialType(PickType(UserDTO, ['status'] as const)),
) {
  @ApiProperty({
    type: String,
    description: '用户名称',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    description: '登陆账号',
  })
  @IsOptional()
  @IsString()
  account?: string;

  take: number;
  skip: number;
}
