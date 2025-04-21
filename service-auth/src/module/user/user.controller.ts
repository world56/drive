import {
  Get,
  Put,
  Post,
  Body,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard } from '@/guard/admin.guard';
import { QueryListPipe } from '@/pipe/query-list.pipe';
import { ValidationDTOPipe } from '@/pipe/validation-dto.pipe';
import { DecryptContextPipe } from '@/pipe/decrypt-context.pipe';
import { DecryptPasswordPipe } from './pipe/decrypt-password.pipe';
import { RuleWhitelist } from '@/decorator/rule-whitelist.decorator';
import { CurrentUser } from '@/decorator/current-user-user.decorator';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserInsertDTO } from './dto/user-insert.dto';
import { UserUpdateDTO } from './dto/usert-update.dto';
import { PrimaryKeyStringDTO } from '@/dto/common.dto';
import { UserListQueryDTO } from './dto/user-list-query.dto';
import { UserPwdChangeDTO } from './dto/user-pwd-change.dto';

import { ENUM_COMMON } from '@/enum/common';

@ApiTags('用户管理')
@RuleWhitelist([ENUM_COMMON.ROLE.SA])
@UseGuards(AdminGuard)
@Controller('user')
export class UserController {
  public constructor(private readonly UserService: UserService) {}

  @ApiOperation({ summary: '用户列表' })
  @RuleWhitelist()
  @Get('list')
  getUserList(@Query(new QueryListPipe()) query: UserListQueryDTO) {
    return this.UserService.getList(query);
  }

  @ApiOperation({ summary: '用户列表' })
  @Get()
  getAllUsers() {
    return this.UserService.getAllUsers();
  }

  @ApiOperation({ summary: '获取用户详情' })
  @Get('detail')
  details(@Query('id') id: string) {
    return this.UserService.getUserInfo(id);
  }

  @ApiOperation({
    summary: '新增用户',
    description: '只有管理员可以新增用户',
  })
  @Post('insert')
  insert(
    @CurrentUser('id') currentUserId: string,
    @Body(DecryptPasswordPipe) body: UserInsertDTO,
  ) {
    return this.UserService.insert(body, currentUserId);
  }

  @ApiOperation({ summary: '编辑用户' })
  @Put('update')
  update(
    @CurrentUser('id') currentUserId: string,
    @Body() body: UserUpdateDTO,
  ) {
    return this.UserService.update(body, currentUserId);
  }

  @ApiOperation({
    summary: '冻结、激活用户',
    description: '用户冻结后，将无法登陆并使用其他功能接口',
  })
  @ApiOkResponse({ type: Boolean })
  @ApiBody({ type: PrimaryKeyStringDTO })
  @Put('status')
  changeUserStatus(
    @CurrentUser('id') currentUserId: string,
    @Body('id') id: string,
  ) {
    return this.UserService.changeUserStatus(id, currentUserId);
  }

  @ApiOperation({ summary: '修改用户密码' })
  @RuleWhitelist()
  @Put('pwd')
  changePassword(
    @CurrentUser('id') currentUserId: string,
    @Body(DecryptContextPipe, new ValidationDTOPipe(UserPwdChangeDTO))
    body: (typeof UserPwdChangeDTO)[keyof typeof UserPwdChangeDTO],
  ) {
    return this.UserService.changePassword(body, currentUserId);
  }
}
