import { OmitType } from '@nestjs/swagger';

import { UserDTO } from '@/dto/user.dto';

export class UserInsertDTO extends OmitType(UserDTO, [
  'id',
  'role',
  'status',
] as const) {}
