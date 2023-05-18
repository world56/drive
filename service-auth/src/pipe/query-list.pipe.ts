import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

interface QueryListPipeParam
  extends Record<'currentPage' | 'pageSize' | 'take' | 'skip', number> {}

@Injectable()
export class QueryListPipe<T extends QueryListPipeParam>
  implements PipeTransform
{
  private pagingParameters(value: T) {
    const { pageSize, currentPage, ...other } = value;
    other.take = pageSize;
    other.skip = (currentPage - 1) * pageSize;
    return other;
  }

  public transform(value: T, metadata: ArgumentMetadata) {
    return value.currentPage ? this.pagingParameters(value) : value;
  }
}
