import { PickType } from '@nestjs/swagger';
import { ResourceDTO } from '@/dto/resource.dto';

export class InsertResourceDTO extends PickType(ResourceDTO, [
  'name',
  'remark',
  'parentId',
] as const) {}
