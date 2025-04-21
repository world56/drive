import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';

export const GetUploadFile = createParamDecorator(
  (params: Parameters<FastifyRequest['file']>[0], context: ExecutionContext) =>
    context
      .switchToHttp()
      .getRequest<FastifyRequest>()
      .file({
        limits: { fileSize: 1024 * 1024 * 10 },
        ...params,
      }),
);
