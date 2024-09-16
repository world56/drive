import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ResourceService } from '@/module/resource/resource.service';
import { FavoriteService } from '@/module/favorite/favorite.service';

import type { Metadata } from '@grpc/grpc-js';

@Controller()
export class GrpcServiceController {
  constructor(
    private readonly ResourceService: ResourceService,
    private readonly FavoriteService: FavoriteService,
  ) {}

  @GrpcMethod('ExplorerService', 'GetCount')
  async getCount(data: null, metadata: Metadata) {
    const count = await this.ResourceService.getCount();
    return { count };
  }

  @GrpcMethod('ExplorerService', 'GetRecently')
  async getRecently() {
    const data = await this.ResourceService.getRecently();
    return { data };
  }

  @GrpcMethod('ExplorerService', 'GetFavorite')
  async getFavorite() {
    const data = await this.FavoriteService.getRanking();
    return { data };
  }

}
