import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('文件管理')
@Controller('file')
export class FileController {}
