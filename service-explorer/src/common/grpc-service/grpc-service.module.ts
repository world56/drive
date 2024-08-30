import { Module } from '@nestjs/common';
import { GrpcServiceController } from './grpc-service.controller';
import { ResourceModule } from '@/module/resource/resource.module';

@Module({
  imports: [ResourceModule],
  controllers: [GrpcServiceController],
})
export class GrpcServiceModule {}
