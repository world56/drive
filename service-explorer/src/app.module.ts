import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './module/favorites/favorites.module';
import { ResourcesModule } from './module/resources/resources.module';

@Module({
  imports: [
    ResourcesModule,
    FavoritesModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
