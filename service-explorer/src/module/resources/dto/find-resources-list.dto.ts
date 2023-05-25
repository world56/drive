import { PartialType } from '@nestjs/swagger';
import { PrimaryKeyStringDTO } from 'src/dto/common.dto';

export class FindResourcesListDTO extends PartialType(PrimaryKeyStringDTO) {}
