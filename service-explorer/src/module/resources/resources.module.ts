import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourcesService } from './resources.service';
import { FileModule } from 'src/common/file/file.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { ResourcesController } from './resources.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import CONFIG_RESOURCE_PATH from 'src/config/resource-path.config';

@Module({
  providers: [ResourcesService],
  controllers: [ResourcesController],
  imports: [
    FileModule,
    RedisModule,
    PrismaModule,
    ConfigModule.forFeature(CONFIG_RESOURCE_PATH),
  ],
})
export class ResourcesModule {}
