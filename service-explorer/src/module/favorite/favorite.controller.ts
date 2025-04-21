import { FavoriteService } from './favorite.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/decorator/current-user-user.decorator';
import { Get, Post, Body, Delete, Controller, Query } from '@nestjs/common';

import { FavoritesUpdateDTO } from './dto/favorites-update.dto';
import { FavoriteFindListDTO } from './dto/favorite-find-list.dto';

@ApiTags('资源收藏')
@Controller('favorite')
export class FavoriteController {
  public constructor(private readonly FavoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '用户收藏列表',
  })
  @Get('list')
  list(@Query() query: FavoriteFindListDTO, @CurrentUser('id') userId: string) {
    return this.FavoriteService.findList(query, userId);
  }

  @ApiOperation({
    summary: '收藏资源',
    description: '单个收藏',
  })
  @Post('insert')
  insert(@Body() data: FavoritesUpdateDTO, @CurrentUser('id') userId: string) {
    return this.FavoriteService.insert(data, userId);
  }

  @ApiOperation({
    summary: '删除收藏资源',
    description: '批量删除已收藏的资源',
  })
  @Delete('remove')
  remove(@Body() body: FavoritesUpdateDTO) {
    return this.FavoriteService.remove(body);
  }
}
