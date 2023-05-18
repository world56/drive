import { IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { UserDTO } from '@/dto/user.dto';

export class UserPwdChangeDTO extends PickType(UserDTO, [
  'id',
  'password',
] as const) {
  @ApiProperty({
    type: String,
    example: '123456',
    description: '规则与用户密码一致',
  })
  @IsString()
  newPassword: string;
}
