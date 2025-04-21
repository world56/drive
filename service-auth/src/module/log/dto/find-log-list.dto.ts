import { LogDTO } from '@/dto/log.dto';
import { PaginationDTO } from '@/dto/common.dto';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export class FindLogListDTO extends IntersectionType(
  PaginationDTO,
  PartialType(PickType(LogDTO, ['event', 'operatorId'] as const)),
) {
  take: number;
  skip: number;
}
