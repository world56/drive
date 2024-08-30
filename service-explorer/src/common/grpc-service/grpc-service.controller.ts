import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ResourceService } from '@/module/resource/resource.service';

import type { Metadata } from '@grpc/grpc-js';

@Controller()
export class GrpcServiceController {
  constructor(private readonly ResourceService: ResourceService) {}

  @GrpcMethod('ExplorerService', 'GetCount')
  async getCount(data: null, metadata: Metadata) {
    const count = await this.ResourceService.getCount();
    return { count };
  }
}
