import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CryptoModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
