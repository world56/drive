import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecoveryModule } from './module/recycle/recycle.module';
import { FavoriteModule } from './module/favorite/favorite.module';
import { ResourceModule } from './module/resource/resource.module';
import { GrpcServiceModule } from './common/grpc-service/grpc-service.module';

@Module({
  imports: [
    ResourceModule,
    FavoriteModule,
    RecoveryModule,
    GrpcServiceModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
