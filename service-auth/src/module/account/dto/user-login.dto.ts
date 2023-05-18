import { UserDTO } from '@/dto/user.dto';
import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UserLoginDTO extends PickType(UserDTO, [
  'account',
  'password',
] as const) {
  @ApiProperty({
    description: '是否记住用户登陆状态（3天ˇ）',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  expire?: boolean;
}
