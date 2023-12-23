import { ResourceDTO } from '@/dto/resource.dto';
import { DeleteResourcesDTO } from './delete-resources.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class MoveResourcesDTO extends IntersectionType(
  DeleteResourcesDTO,
  PickType(ResourceDTO, ['parentId'] as const),
) {}
