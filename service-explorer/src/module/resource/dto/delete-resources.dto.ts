import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteResourcesDTO {
  @ApiProperty({
    required: true,
    type: [String],
    description: '资源ID列表（文件、文件夹）',
  })
  @IsString({ each: true })
  ids: string[];
}
