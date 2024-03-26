import {
  Injectable,
  ConflictException,
  PreconditionFailedException,
} from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CryptoService } from '@/module/crypto/crypto.service';

import { UserDTO } from '@/dto/user.dto';
import { UserInsertDTO } from './dto/user-insert.dto';
import { UserUpdateDTO } from './dto/usert-update.dto';
import { UserListQueryDTO } from './dto/user-list-query.dto';
import { UserPwdChangeDTO } from './dto/user-pwd-change.dto';

import { ENUM_COMMON } from '@/enum/common';

import type { TypeCurrentUserDecorator } from '@/decorator/current-user-user.decorator';

@Injectable()
export class UserService {
  public constructor(
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
    private readonly CryptoService: CryptoService,
  ) {}

  async getList({ take, skip, name, status, account }: UserListQueryDTO) {
    const where = {
      status,
      name: { contains: name },
      role: ENUM_COMMON.ROLE.REG,
      account: { contains: account },
    };
    const [count, list] = await Promise.all([
      this.PrismaService.user.count({ where }),
      this.PrismaService.user.findMany({
        take,
        skip,
        where,
        orderBy: { createTime: 'desc' },
      }),
    ]);
    return { count, list };
  }

  async getUserInfo(id: string) {
    const data = await this.PrismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        remark: true,
        status: true,
        account: true,
        contact: true,
      },
    });
    return data || {};
  }

  async insert(
    body: UserInsertDTO & Pick<InstanceType<typeof UserDTO>, 'role'>,
  ) {
    const user = await this.PrismaService.user.findUnique({
      select: { id: true },
      where: { account: body.account },
    });
    if (user) {
      throw new ConflictException('该登录账户已被注册，请更换后重试');
    }
    body.password = this.CryptoService.md5(body.password);
    await this.PrismaService.user.create({ data: body });
    return true;
  }

  async update({ id, ...data }: UserUpdateDTO) {
    await this.PrismaService.user.update({
      where: { id },
      select: { id: true },
      data,
    });
    return true;
  }

  async changeUserStatus(id: string) {
    const user = await this.PrismaService.user.findUnique({ where: { id } });
    await this.PrismaService.user.update({
      where: { id },
      data: { status: Number(!user.status) },
    });
    return true;
  }

  async changePassword(body: UserPwdChangeDTO, currentUserId: string) {
    const { id, pwd, password } = body;
    const [{ role }, user] = await Promise.all([
      this.PrismaService.user.findUnique({
        where: { id: currentUserId },
        select: { role: true },
      }),
      this.PrismaService.user.findUnique({ where: { id } }),
    ]);
    if (role === ENUM_COMMON.ROLE.REG && currentUserId !== id) {
      throw new PreconditionFailedException('操作非法');
    }
    if (user.password !== this.CryptoService.md5(pwd)) {
      throw new PreconditionFailedException('旧密码错误，请确认后重试');
    }
    await this.PrismaService.user.update({
      where: { id },
      data: { password: this.CryptoService.md5(password) },
    });
    return true;
  }
}
