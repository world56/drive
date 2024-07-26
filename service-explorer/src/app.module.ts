import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecoveryModule } from './module/recycle/recycle.module';
import { FavoriteModule } from './module/favorite/favorite.module';
import { ResourceModule } from './module/resource/resource.module';

@Module({
  imports: [
    ResourceModule,
    FavoriteModule,
    RecoveryModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
