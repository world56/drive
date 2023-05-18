import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { CryptoModule } from './module/crypto/crypto.module';
import { AccountModule } from './module/account/account.module';

@Module({
  imports: [
    CryptoModule,
    AccountModule,
    UserModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
  ],
})
export class AppModule {}
