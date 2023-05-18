import {
  Injectable,
  ImATeapotException,
  ForbiddenException,
  UnauthorizedException,
  PreconditionFailedException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UserService } from '@/module/user/user.service';
import { RedisService } from '@/common/redis/redis.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CryptoService } from '@/module/crypto/crypto.service';

import { UserLoginDTO } from './dto/user-login.dto';
import { RegisterSuperAdminDTO } from './dto/register-super-admin.dto';

import { ENUM_COMMON } from '@/enum/common';

@Injectable()
export class AccountService {
  public constructor(
    private readonly UserService: UserService,
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
    private readonly CryptoService: CryptoService,
  ) {}

  private readonly ONE_DAY = 86400;

  async security(token: string, ip: string) {
    const user = await this.RedisService.hgetall(`drive:user:${token}`);
    if (user.ip !== ip) {
      throw new ImATeapotException('账户登录IP与当前网络IP不一致');
    }
    return true;
  }

  async getSuperAdmin() {
    const admin = await this.PrismaService.user.findFirst({
      where: { isSuper: ENUM_COMMON.SUPER_ADMIN.SUPER },
    });
    return Boolean(admin);
  }

  async getUserInfo(token: string) {
    const key = `drive:user:${token}`;
    const user = await this.RedisService.hgetall(key);
    if (user?.id) {
      const { id, name, isSuper } = user;
      return { id, name, isSuper: parseInt(isSuper) };
    } else {
      await this.RedisService.del(key);
      throw new UnauthorizedException('登录超时');
    }
  }

  async register(body: InstanceType<typeof RegisterSuperAdminDTO>) {
    const admin = await this.PrismaService.user.findFirst({
      where: { account: body.account },
    });
    if (admin) {
      throw new PreconditionFailedException(
        '系统已存在系统管理员，请联系系统管理员确认登陆信息',
      );
    }
    await this.UserService.insert({
      ...body,
      name: '管理员',
      isSuper: ENUM_COMMON.SUPER_ADMIN.SUPER,
    });
    return true;
  }

  async login(body: UserLoginDTO) {
    const { expire, ...where } = body;
    where.password = this.CryptoService.md5(where.password);
    const user = await this.PrismaService.user.findUnique({
      where: { account_password: where },
      select: { id: true, name: true, isSuper: true, status: true },
    });
    if (user) {
      if (user.status === ENUM_COMMON.STATUS.FREEZE) {
        throw new ForbiddenException('账号被冻结，请联系系统管理员');
      }
      const token = nanoid();
      const key = `drive:user:${token}`;
      await this.RedisService.hset(key, user);
      await this.RedisService.expire(
        key,
        expire ? this.ONE_DAY * 7 : this.ONE_DAY,
      );
      return token;
    } else {
      throw new PreconditionFailedException('账户或密码错误，请重试');
    }
  }

  async logout(token: string) {
    const key = `drive:user:${token}`;
    if (await this.RedisService.exists(key)) {
      await this.RedisService.del(key);
      return true;
    }
    return false;
  }
}
