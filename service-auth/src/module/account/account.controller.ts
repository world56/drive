import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { ValidationDTOPipe } from '@/pipe/validation-dto.pipe';
import { DecryptContextPipe } from '@/pipe/decrypt-context.pipe';
import { CurrentUser } from '@/decorator/current-user-user.decorator';
import { Get, Post, Body, UsePipes, Controller } from '@nestjs/common';

import { UserLoginDTO } from './dto/user-login.dto';
import { RegisterSuperAdminDTO } from './dto/register-super-admin.dto';

@ApiTags('身份验证')
@Controller('account')
export class AccountController {
  public constructor(private readonly AccountService: AccountService) {}

  @ApiOperation({
    summary: '是否存在超级管理员',
    description: '用于登陆页面，如果没有超级管理员，则必须先注册超级管理员账户',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'true 存在超管 false 没有注册超管（需要走注册超管流程）',
  })
  @Get('super')
  superAdminStatus() {
    return this.AccountService.getSuperAdmin();
  }

  @ApiOperation({ summary: '注册超级管理员' })
  @Post('register')
  @UsePipes(DecryptContextPipe, new ValidationDTOPipe(RegisterSuperAdminDTO))
  register<T extends RegisterSuperAdminDTO>(@Body() body: T) {
    return this.AccountService.register(body);
  }

  @ApiOperation({
    summary: '获取用户登陆信息',
    description: 'HTTP header需要Authorization字段及值',
  })
  @ApiOkResponse({
    description: '登陆成功后，会解析Authorization，返回用户信息',
  })
  @ApiUnauthorizedResponse({
    description: '用户的token的有效期超时，需要重新登陆认证',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'token',
  })
  @Post('user')
  getUserInfo(@CurrentUser('authorization') token: string) {
    return this.AccountService.getUserInfo(token);
  }

  @ApiOperation({ summary: '登陆' })
  @Post('login')
  login<T extends InstanceType<typeof UserLoginDTO>>(
    @Body(DecryptContextPipe, new ValidationDTOPipe(UserLoginDTO))
    body: T,
  ) {
    return this.AccountService.login(body);
  }

  @ApiOperation({ summary: '退出登陆' })
  @Post('logout')
  logout(@CurrentUser('authorization') token: string) {
    return this.AccountService.logout(token);
  }
}
