import { UserDTO } from '@/dto/user.dto';
import { PickType } from '@nestjs/swagger';

export class RegisterSuperAdminDTO extends PickType(UserDTO, [
  'account',
  'password',
] as const) {}
