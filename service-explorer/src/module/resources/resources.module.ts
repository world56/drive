import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  providers: [ResourcesService],
  controllers: [ResourcesController],
  imports: [PrismaModule],
})
export class ResourcesModule {}
