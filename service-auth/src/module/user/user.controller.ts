import {
  Get,
  Put,
  Post,
  Body,
  Query,
  UsePipes,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryListPipe } from '@/pipe/query-list.pipe';
import { ValidationDTOPipe } from '@/pipe/validation-dto.pipe';
import { DecryptContextPipe } from '@/pipe/decrypt-context.pipe';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserInsertDTO } from './dto/user-insert.dto';
import { UserUpdateDTO } from './dto/usert-update.dto';
import { PrimaryKeyStringDTO } from '@/dto/common.dto';
import { UserListQueryDTO } from './dto/user-list-query.dto';
import { UserPwdChangeDTO } from './dto/user-pwd-change.dto';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  public constructor(private readonly UserService: UserService) {}

  @ApiOperation({ summary: '用户列表' })
  @Get('list')
  getUserList(@Query(new QueryListPipe()) query: UserListQueryDTO) {
    return this.UserService.getList(query);
  }

  @ApiOperation({ summary: '获取用户详情' })
  @Get('details')
  details(@Query('id', new ParseUUIDPipe()) id: string) {
    return this.UserService.getUserInfo(id);
  }

  @ApiOperation({
    summary: '新增用户',
    description: '只有管理员可以新增用户',
  })
  @Post('insert')
  @UsePipes(DecryptContextPipe, new ValidationDTOPipe(UserInsertDTO))
  insert(@Body() body: UserInsertDTO) {
    return this.UserService.insert(body);
  }

  @ApiOperation({ summary: '编辑用户' })
  @Put('update')
  @UsePipes(DecryptContextPipe, new ValidationDTOPipe(UserUpdateDTO))
  update(@Body() body: UserUpdateDTO) {
    return this.UserService.update(body);
  }

  @ApiOperation({
    summary: '冻结、激活用户',
    description: '用户冻结后，将无法登陆并使用其他功能接口',
  })
  @ApiOkResponse({ type: Boolean })
  @ApiBody({ type: PrimaryKeyStringDTO })
  @Put('status')
  changeUserStatus(@Body('id', new ParseUUIDPipe()) id: string) {
    return this.UserService.changeUserStatus(id);
  }

  @ApiOperation({ summary: '修改用户密码' })
  @Put('pwd')
  @UsePipes(DecryptContextPipe, new ValidationDTOPipe(UserPwdChangeDTO))
  changePassword(@Body() body: UserPwdChangeDTO) {
    return this.UserService.changePassword(body);
  }
}
