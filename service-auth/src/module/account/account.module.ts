import { Module } from '@nestjs/common';
import { LogModule } from '../log/log.module';
import { UserModule } from '../user/user.module';
import { AccountService } from './account.service';
import { CryptoModule } from '../crypto/crypto.module';
import { AccountController } from './account.controller';
import { RedisModule } from '@/common/redis/redis.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { GrpcClientModule } from '@/common/grpc-client/grpc-client.module';

@Module({
  imports: [
    LogModule,
    UserModule,
    RedisModule,
    PrismaModule,
    CryptoModule,
    GrpcClientModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
