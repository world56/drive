import {
  Injectable,
  ConflictException,
  PreconditionFailedException,
} from '@nestjs/common';
import { LogService } from '../log/log.service';
import { RedisService } from '@/common/redis/redis.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CryptoService } from '@/module/crypto/crypto.service';

import { UserDTO } from '@/dto/user.dto';
import { UserInsertDTO } from './dto/user-insert.dto';
import { UserUpdateDTO } from './dto/usert-update.dto';
import { UserListQueryDTO } from './dto/user-list-query.dto';
import { UserPwdChangeDTO } from './dto/user-pwd-change.dto';

import { ENUM_LOG } from '@/enum/log';
import { ENUM_COMMON } from '@/enum/common';

@Injectable()
export class UserService {
  public constructor(
    private readonly LogService: LogService,
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
    private readonly CryptoService: CryptoService,
  ) {}

  private readonly DEFAULT_SELECT = {
    id: true,
    name: true,
    role: true,
    status: true,
    account: true,
    createTime: true,
  };

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
      select: this.DEFAULT_SELECT,
    });
    return data || {};
  }

  async insert(
    body: UserInsertDTO & Pick<InstanceType<typeof UserDTO>, 'role'>,
    operatorId?: string,
  ) {
    const user = await this.PrismaService.user.findUnique({
      select: { id: true },
      where: { account: body.account },
    });
    if (user) {
      throw new ConflictException('该登录账户已被注册，请更换后重试');
    }
    body.password = this.CryptoService.md5(body.password);
    const desc = await this.PrismaService.user.create({
      data: body,
      select: this.DEFAULT_SELECT,
    });
    operatorId &&
      this.LogService.write({
        desc,
        operatorId,
        event: ENUM_LOG.EVENT.USER_INSERT,
      });
    return true;
  }

  async update({ id, ...data }: UserUpdateDTO, operatorId: string) {
    const desc = await this.PrismaService.user.update({
      data,
      where: { id },
      select: this.DEFAULT_SELECT,
    });
    this.LogService.write({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.USER_UPDATE,
    });
    return true;
  }

  async changeUserStatus(id: string, operatorId: string) {
    const user = await this.PrismaService.user.findUnique({ where: { id } });
    const desc = await this.PrismaService.user.update({
      where: { id },
      select: this.DEFAULT_SELECT,
      data: { status: Number(!user.status) },
    });
    this.LogService.write({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.USER_STATUS,
    });
    return true;
  }

  async changePassword(body: UserPwdChangeDTO, operatorId: string) {
    const { id, pwd, password } = body;
    const [{ role }, user] = await Promise.all([
      this.PrismaService.user.findUnique({
        where: { id: operatorId },
        select: { role: true },
      }),
      this.PrismaService.user.findUnique({ where: { id } }),
    ]);
    if (role === ENUM_COMMON.ROLE.REG && operatorId !== id) {
      throw new PreconditionFailedException('操作非法');
    }
    if (user.password !== this.CryptoService.md5(pwd)) {
      throw new PreconditionFailedException('旧密码错误，请确认后重试');
    }
    const desc = await this.PrismaService.user.update({
      where: { id },
      select: this.DEFAULT_SELECT,
      data: { password: this.CryptoService.md5(password) },
    });
    this.LogService.write({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.USER_PWD_UPDATE,
    });
    return true;
  }
}
