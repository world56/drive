import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PrimaryKeyStringDTO } from 'src/dto/common.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';


export class FindResourcesListDTO extends PartialType(PrimaryKeyStringDTO) {
  @ApiProperty({
    type: String,
    description: '排序类型',
    enum: ENUM_RESOURCE.SORT,
  })
  @IsEnum(ENUM_RESOURCE.SORT)
  @IsOptional()
  @IsString()
  type: ENUM_RESOURCE.SORT;

  @ApiProperty({
    type: String,
    description: '排序方式',
    enum: ENUM_RESOURCE.ORDER,
  })
  @IsEnum(ENUM_RESOURCE.ORDER)
  @IsOptional()
  @IsString()
  order: ENUM_RESOURCE.ORDER;
}
