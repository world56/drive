import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { LogModule } from '../log/log.module';
import { UserController } from './user.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { RedisModule } from '@/common/redis/redis.module';

@Module({
  imports: [PrismaModule, CryptoModule, RedisModule, LogModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
