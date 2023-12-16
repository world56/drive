import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesRemoveDTO {
  @ApiProperty({
    required: true,
    type: [String],
    isArray: true,
    description: '资源ID',
  })
  @IsString({
    each: true,
    message: '收藏资源ID不得为空',
  })
  ids: string[];
}
