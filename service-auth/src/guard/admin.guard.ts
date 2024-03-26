import { Reflector } from '@nestjs/core';
import { RedisService } from '@/common/redis/redis.service';
import { Injectable, PreconditionFailedException } from '@nestjs/common';

import { ENUM_COMMON } from '@/enum/common';

import type { FastifyRequest } from 'fastify';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly RedisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const { authorization } = context
      .switchToHttp()
      .getRequest<FastifyRequest>().headers;
    const ACCESS_ROLE = this.reflector.getAllAndMerge<ENUM_COMMON.ROLE[]>(
      'rule',
      [context.getClass(), context.getHandler()],
    );
    const role = await this.RedisService.hget(
      `drive:user:${authorization}`,
      'role',
    );
    if (ACCESS_ROLE.includes(Number(role))) {
      return true;
    }
    throw new PreconditionFailedException('非法访问，请联系管理员');
  }
}
