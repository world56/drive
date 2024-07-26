import { RecycleService } from './recycle.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Body, Post } from '@nestjs/common';
import { CurrentUser } from '@/decorator/current-user-user.decorator';

import { RecycleUpdateDTO } from './dto/recycle-update.dto';

@ApiTags('回收站')
@Controller('recovery')
export class RecoveryController {
  constructor(private readonly RecycleService: RecycleService) {}

  @ApiOperation({
    summary: '回收站列表',
  })
  @Get()
  getList() {
    return this.RecycleService.getList();
  }

  @ApiOperation({
    summary: '恢复资源',
  })
  @Post()
  recover(@Body() body: RecycleUpdateDTO, @CurrentUser('id') id: string) {
    return this.RecycleService.recover(body, id);
  }

  @ApiOperation({
    summary: '彻底删除',
  })
  @Delete()
  remove(@Body() body: RecycleUpdateDTO, @CurrentUser('id') id: string) {
    return this.RecycleService.remove(body, id);
  }
}
