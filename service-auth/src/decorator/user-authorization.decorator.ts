import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';

export const UserAuthorization = createParamDecorator(
  (params: undefined, context: ExecutionContext) =>
    context.switchToHttp().getRequest<FastifyRequest>().headers.authorization,
);
