import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './module/favorites/favorites.module';
import { ResourcesModule } from './module/resources/resources.module';
import { FileModule } from './common/file/file.module';

@Module({
  imports: [
    ResourcesModule,
    FavoritesModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
    FileModule,
  ],
})
export class AppModule {}
