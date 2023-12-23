import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FavoriteModule } from './module/favorite/favorite.module';
import { ResourceModule } from './module/resource/resource.module';

@Module({
  imports: [
    ResourceModule,
    FavoriteModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
