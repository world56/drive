import { Module } from '@nestjs/common';
import { RecycleService } from './recycle.service';
import { FileModule } from '@/common/file/file.module';
import { RecoveryController } from './recycle.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { GrpcClientModule } from '@/common/grpc-client/grpc-client.module';

@Module({
  imports: [PrismaModule, FileModule, GrpcClientModule],
  controllers: [RecoveryController],
  providers: [RecycleService],
  exports: [RecycleService],
})
export class RecoveryModule {}
