import { OmitType } from '@nestjs/swagger';
import { ResourceDTO } from '@/dto/resource.dto';

export class InsertResourceDTO extends OmitType(ResourceDTO, ['id'] as const) {}
