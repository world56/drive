import { Module } from '@nestjs/common';
import { GrpcServiceController } from './grpc-service.controller';
import { ResourceModule } from '@/module/resource/resource.module';
import { FavoriteModule } from '@/module/favorite/favorite.module';

@Module({
  imports: [ResourceModule, FavoriteModule],
  controllers: [GrpcServiceController],
})
export class GrpcServiceModule {}
