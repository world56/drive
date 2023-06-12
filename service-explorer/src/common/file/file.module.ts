import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';

import CONFIG_FILE_TYPE from '@/config/file-type.config';
import CONFIG_RESOURCE_PATH from '@/config/resource-path.config';

@Module({
  exports: [FileService],
  providers: [FileService],
  imports: [
    ConfigModule.forRoot({
      load: [CONFIG_FILE_TYPE, CONFIG_RESOURCE_PATH],
    }),
  ],
})
export class FileModule {}
