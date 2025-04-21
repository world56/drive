import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { UtilsModule } from '@/common/utils/utils.module';
import { FavoriteController } from './favorite.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { ResourceModule } from '@/module/resource/resource.module';

@Module({
  imports: [ResourceModule, PrismaModule, UtilsModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
