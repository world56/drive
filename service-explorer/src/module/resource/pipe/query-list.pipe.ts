import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Resource } from '@prisma/client';

interface TypeQueryResources
  extends Record<'order' | 'type', string>,
    Pick<Resource, 'id'> {}

@Injectable()
export class QueryListPipe implements PipeTransform {
  private getParam(param: string) {
    return param.substring(5, param.length).toLowerCase();
    // return param
    //   .substring(5, param.length)
    //   .toLowerCase()
    //   .replace(/_./g, (match) => match.charAt(1).toUpperCase());
  }

  transform(value: TypeQueryResources, metadata: ArgumentMetadata) {
    const { id, order, type } = value;
    return {
      id,
      type: this.getParam(type),
      order: this.getParam(order),
    };
  }
}
