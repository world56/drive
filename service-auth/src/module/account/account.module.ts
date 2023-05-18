import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AccountService } from './account.service';
import { CryptoModule } from '../crypto/crypto.module';
import { AccountController } from './account.controller';
import { RedisModule } from '@/common/redis/redis.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [UserModule, RedisModule, PrismaModule, CryptoModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
