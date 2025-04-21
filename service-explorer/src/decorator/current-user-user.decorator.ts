import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';

export interface TypeCurrentUserDecorator
  extends Record<'id' | 'role', string> {
  /**
   * @param authorization 用户token
   */
  authorization: string;
}

/**
 * @name CurrentUser 当前登录用户
 */
export const CurrentUser = createParamDecorator(
  (
    field: keyof TypeCurrentUserDecorator | undefined,
    context: ExecutionContext,
  ) => {
    const { headers } = context.switchToHttp().getRequest<FastifyRequest>();
    const currentUser = {
      id: headers['user-id'],
      role: Number(headers['user-role']),
      authorization: headers.authorization,
    };
    return field ? currentUser[field] : currentUser;
  },
);
