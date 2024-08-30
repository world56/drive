import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './module/log/log.module';
import { UserModule } from './module/user/user.module';
import { CryptoModule } from './module/crypto/crypto.module';
import { AccountModule } from './module/account/account.module';
import { GrpcServiceModule } from './common/grpc-service/grpc-service.module';
import { GrpcClientModule } from './common/grpc-client/grpc-client.module';

@Module({
  imports: [
    LogModule,
    UserModule,
    CryptoModule,
    AccountModule,
    GrpcServiceModule,
    ConfigModule.forRoot({ envFilePath: `.env` }),
    GrpcClientModule,
  ],
})
export class AppModule {}
