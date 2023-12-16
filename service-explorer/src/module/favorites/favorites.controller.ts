import { UserID } from '@/decorator/user-id.decorator';
import { FavoritesService } from './favorites.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Get, Delete, Query, Body, Controller, Param } from '@nestjs/common';
import { ResourcesService } from '@/module/resources/resources.service';

import { FavoritesRemoveDTO } from './dto/favorites-remove.dto';
import { FavoritesInsertDTO } from './dto/favorites-insert.dto';

@ApiTags('资源收藏')
@Controller('favorite')
export class FavoritesController {
  public constructor(
    private readonly ResourcesService: ResourcesService,
    private readonly FavoritesService: FavoritesService,
  ) {}

  @ApiOperation({
    summary: '用户收藏列表',
  })
  @Get('list')
  list(@UserID() userId: string) {
    return this.FavoritesService.findList(userId);
  }

  @ApiOperation({
    summary: '收藏资源',
    description: '单个收藏',
  })
  @Get(':resourceId')
  insert(@Param('resourceId') id: string, @UserID() userId: string) {
    return this.FavoritesService.insert(id, userId);
  }

  @ApiOperation({
    summary: '删除收藏资源',
    description: '批量删除已收藏的资源',
  })
  @Delete('delete')
  remove(@Query() query: FavoritesRemoveDTO) {
    return this.FavoritesService.remove(query);
  }
}
