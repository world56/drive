import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './module/file/file.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    FileModule,
    RedisModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
