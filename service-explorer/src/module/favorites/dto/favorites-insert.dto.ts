import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class FavoritesInsertDTO {
  @ApiProperty({
    required: true,
    type: String,
    description: '资源ID',
  })
  @IsUUID()
  @IsString()
  resourceId: string;
}
