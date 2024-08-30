import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LogService } from '@/module/log/log.service';
import { UserService } from '@/module/user/user.service';

import type { Log } from '@prisma/client';
import type { Metadata } from '@grpc/grpc-js';

@Controller()
export class GrpcServiceController {
  public constructor(
    private readonly LogService: LogService,
    private readonly UserService: UserService,
  ) {}

  @GrpcMethod('LogService', 'WriteLog')
  writeLog(data: Omit<Log, 'id' | 'createTime'>, metadata: Metadata) {
    return this.LogService.write(data);
  }

  @GrpcMethod('UserService', 'GetUserInfo')
  getUserInfo(data: { id: string }, metadata: Metadata) {
    return this.UserService.getUserInfo(data.id);
  }
}
