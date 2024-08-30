import { Inject, Injectable } from '@nestjs/common';

import type { ClientGrpc } from '@nestjs/microservices';

namespace TypeGRPC {
  export interface Stats {
    access(data: { id: string }): any;
  }
}

@Injectable()
export class GrpcClientService {
  private RpcStats: TypeGRPC.Stats;

  public constructor(
    @Inject('GRPC_STATS') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.RpcStats = this.client.getService<TypeGRPC.Stats>('StatsService');
  }

  access(id: string) {
    this.RpcStats.access({ id }).subscribe();
  }
}
