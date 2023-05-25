import { IsString } from 'class-validator';

export class DeleteResourcesDTO {
  @IsString({ each: true })
  ids: string[];
}
