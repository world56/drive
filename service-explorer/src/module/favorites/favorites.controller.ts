import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('资源收藏')
@Controller('favorites')
export class FavoritesController {
  @ApiOperation({ summary: '用户收藏列表' })
  @Get('list')
  list() {
    return true;
  }
}
