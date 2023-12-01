import { Module } from '@nestjs/common';
import { GRPCController } from './grpc.controller';
import { UserModule } from '@/module/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GRPCController],
})
export class GrpcModule {}
