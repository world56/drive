import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { UserDTO } from '@/dto/user.dto';

export class UserUpdateDTO extends IntersectionType(
  PickType(UserDTO, ['id', 'name'] as const),
  PartialType(PickType(UserDTO, ['password'] as const)),
) {}
