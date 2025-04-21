import { Type } from 'class-transformer';
import { Min, IsInt, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PrimaryKeyStringDTO {
  @ApiProperty({ description: '主键ID' })
  @IsString()
  id: string;
}

export class PrimaryKeyIntDTO {
  @ApiProperty({ description: '主键ID' })
  @Type(() => Number)
  @IsInt()
  id: number;
}

export class PaginationDTO extends PartialType(PrimaryKeyStringDTO) {
  @ApiProperty({
    default: 1,
    required: true,
    description: '当前页码',
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  currentPage: number;

  @ApiProperty({
    default: 15,
    required: true,
    description: '每页条数',
  })
  @Min(1)
  @Type(() => Number)
  @IsInt()
  pageSize: number;
}
