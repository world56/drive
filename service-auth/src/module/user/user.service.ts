import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CryptoService } from '@/module/crypto/crypto.service';
import { Injectable, PreconditionFailedException } from '@nestjs/common';

import { UserDTO } from '@/dto/user.dto';
import { UserInsertDTO } from './dto/user-insert.dto';
import { UserUpdateDTO } from './dto/usert-update.dto';
import { UserListQueryDTO } from './dto/user-list-query.dto';
import { UserPwdChangeDTO } from './dto/user-pwd-change.dto';

import { ENUM_COMMON } from '@/enum/common';

@Injectable()
export class UserService {
  public constructor(
    private readonly PrismaService: PrismaService,
    private readonly CryptoService: CryptoService,
  ) {}

  async getList({ take, skip, name, status, account }: UserListQueryDTO) {
    const where = {
      status,
      name: { contains: name },
      account: { contains: account },
      isSuper: ENUM_COMMON.SUPER_ADMIN.NOT_SUPER,
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


  @GrpcMethod()
  getUserInfo(id: string) {
    return this.PrismaService.user.findUnique({
      where: { id },
      select: { id: true, name: true, status: true, account: true },
    });
  }

  insert(body: UserInsertDTO & Pick<InstanceType<typeof UserDTO>, 'isSuper'>) {
    body.password = this.CryptoService.md5(body.password);
    return this.PrismaService.user.create({ data: body });
  }

  update({ id, ...data }: UserUpdateDTO) {
    if (data.password) {
      data.password = this.CryptoService.md5(data.password);
    }
    return this.PrismaService.user.update({
      where: { id },
      data,
    });
  }

  async changeUserStatus(id: string) {
    const user = await this.PrismaService.user.findUnique({ where: { id } });
    return this.PrismaService.user.update({
      where: { id },
      data: { status: Number(!user.status) },
    });
  }

  async changePassword(body: UserPwdChangeDTO) {
    const { id } = body;
    const user = await this.PrismaService.user.findUnique({ where: { id } });
    const oldPwd = this.CryptoService.md5(body.password);
    if (user.password !== oldPwd) {
      throw new PreconditionFailedException('旧密码错误，请确认后重试');
    } else {
      await this.PrismaService.user.update({
        where: { id },
        data: { password: this.CryptoService.md5(body.newPassword) },
      });
      return true;
    }
  }
}
