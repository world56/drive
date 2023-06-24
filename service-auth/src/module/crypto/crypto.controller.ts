import { CryptoService } from './crypto.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('密钥')
@Controller('crypto')
export class CryptoController {
  public constructor(private readonly CryptoService: CryptoService) {}

  @ApiOperation({
    summary: '获取公钥（客户端）',
  })
  @ApiOkResponse({
    type: String,
  })
  @Get()
  getSecret() {
    return this.CryptoService.get('public');
  }
}
