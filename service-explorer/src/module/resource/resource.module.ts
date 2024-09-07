import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourceService } from './resource.service';
import { FileModule } from 'src/common/file/file.module';
import { ResourceController } from './resource.controller';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { GrpcClientModule } from '@/common/grpc-client/grpc-client.module';

import CONFIG_RESOURCE_PATH from 'src/config/resource-path.config';

@Module({
  providers: [ResourceService],
  controllers: [ResourceController],
  imports: [
    FileModule,
    RedisModule,
    PrismaModule,
    GrpcClientModule,
    ConfigModule.forFeature(CONFIG_RESOURCE_PATH),
  ],
  exports: [ResourceService],
})
export class ResourceModule {}
