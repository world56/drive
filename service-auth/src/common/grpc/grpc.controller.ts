import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '@/module/user/user.service';

import type { Metadata } from '@grpc/grpc-js';

@Controller()
export class GRPCController {
  public constructor(private readonly UserService: UserService) {}

  @GrpcMethod('UserService', 'GetUserInfo')
  getUserInfo(data: { id: string }, metadata: Metadata) {
    return this.UserService.getUserInfo(data.id);
  }
}
