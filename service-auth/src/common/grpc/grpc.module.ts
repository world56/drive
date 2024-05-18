import { Module } from '@nestjs/common';
import { GRPCController } from './grpc.controller';
import { LogModule } from '@/module/log/log.module';
import { UserModule } from '@/module/user/user.module';

@Module({
  imports: [UserModule, LogModule],
  controllers: [GRPCController],
})
export class GrpcModule {}
