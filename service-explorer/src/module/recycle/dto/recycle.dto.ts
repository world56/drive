import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecycleDTO {
  @ApiProperty({ description: '操作人' })
  @IsString()
  operatorId: string;

  @ApiProperty({ description: '资源ID' })
  @IsString()
  resourceId: string;
}
