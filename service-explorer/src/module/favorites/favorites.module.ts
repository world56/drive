import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { ResourcesModule } from '@/module/resources/resources.module';

@Module({
  imports: [ResourcesModule, PrismaModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
