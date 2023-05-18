import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { UserDTO } from '@/dto/user.dto';
import { PaginationDTO } from '@/dto/common.dto';

export class UserListQueryDTO extends IntersectionType(
  PaginationDTO,
  PartialType(PickType(UserDTO, ['name', 'account', 'status'] as const)),
) {
  take: number;
  skip: number;
}
