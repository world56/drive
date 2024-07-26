import { Module } from '@nestjs/common';
import { RecycleService } from './recycle.service';
import { GrpcModule } from '@/common/grpc/grpc.module';
import { FileModule } from '@/common/file/file.module';
import { RecoveryController } from './recycle.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule, FileModule, GrpcModule],
  controllers: [RecoveryController],
  providers: [RecycleService],
  exports: [RecycleService],
})
export class RecoveryModule {}
