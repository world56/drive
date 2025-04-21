import { LogService } from './log.service';
import { QueryListPipe } from '@/pipe/query-list.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';

import { FindLogListDTO } from './dto/find-log-list.dto';

@ApiTags('系统日志')
@Controller('log')
export class LogController {
  public constructor(private readonly LogService: LogService) {}

  @ApiOperation({
    summary: '查询日志列表',
  })
  @Get()
  list(@Query(QueryListPipe) query: FindLogListDTO) {
    return this.LogService.getList(query);
  }
}
