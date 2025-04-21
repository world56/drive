import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';

import type { FastifyRequest } from 'fastify';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UploadFileGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    if (context.switchToHttp().getRequest<FastifyRequest>().isMultipart()) {
      return true;
    } else {
      throw new UnsupportedMediaTypeException();
    }
  }
}
