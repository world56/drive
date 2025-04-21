import { Module } from '@nestjs/common';
import { LogModule } from '@/module/log/log.module';
import { UserModule } from '@/module/user/user.module';
import { GrpcServiceController } from './grpc-service.controller';

@Module({
  imports: [UserModule, LogModule],
  controllers: [GrpcServiceController],
})
export class GrpcServiceModule {}
