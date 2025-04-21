import { PickType } from '@nestjs/swagger';

import { UserDTO } from '@/dto/user.dto';

export class UserUpdateDTO extends PickType(UserDTO, [
  'id',
  'name',
  'remark',
  'contact'
] as const) {}
