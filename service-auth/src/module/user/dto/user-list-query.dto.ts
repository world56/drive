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
  PartialType(PickType(UserDTO, ['account', 'status'] as const)),
) {
  @ApiProperty({description: '用户名称'})
  @IsOptional()
  @IsString()
  name?: string;

  take: number;
  skip: number;
}
