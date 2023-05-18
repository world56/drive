import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [RedisModule],
  exports: [CryptoService],
  providers: [CryptoService],
  controllers: [CryptoController],
})
export class CryptoModule {}
