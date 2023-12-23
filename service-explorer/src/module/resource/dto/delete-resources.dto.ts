import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteResourcesDTO {
  @ApiProperty({
    required: true,
    type: [String],
    description: '资源ID列表（文件、文件夹）',
  })
  @IsString({ each: true })
  ids: string[];
}
