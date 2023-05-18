import { GetClientToken } from '@/decorator/get-client-token.decorator';
import { CryptoService } from './crypto.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('密钥')
@Controller('crypto')
export class CryptoController {
  public constructor(private readonly CryptoService: CryptoService) {}

  @ApiOperation({
    summary: '返回公钥（客户端）',
  })
  @ApiOkResponse({
    type: String,
  })
  @Get()
  getSecret( @GetClientToken() asd) {
    return this.CryptoService.get('public');
  }
}
