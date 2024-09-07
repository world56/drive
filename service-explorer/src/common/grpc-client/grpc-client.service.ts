import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import type { Observable } from 'rxjs';
import type { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';

namespace TypeGRPC {
  export interface User {
    getUserInfo(data: {
      id: string;
    }): Observable<Record<'id' | 'name', string>>;
  }
  export interface Log {
    writeLog(data: {
      event: string;
      desc: any;
      operatorId: string;
    }): Observable<void>;
  }
  export interface Stats {
    count(params: Record<'type' | 'count', number>): Observable<void>;
  }
}

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private RPCLog: TypeGRPC.Log;
  private RPCUser: TypeGRPC.User;
  private RPCStats: TypeGRPC.Stats;

  public constructor(
    @Inject('GRPC_AUTH') private readonly ClientAuth: ClientGrpc,
    @Inject('GRPC_STATS') private readonly ClientStats: ClientGrpc,
  ) {}

  onModuleInit() {
    this.RPCLog = this.ClientAuth.getService<TypeGRPC.Log>('LogService');
    this.RPCUser = this.ClientAuth.getService<TypeGRPC.User>('UserService');
    this.RPCStats = this.ClientStats.getService<TypeGRPC.Stats>('StatsService');
  }

  getUserInfo(id: string) {
    return firstValueFrom(this.RPCUser.getUserInfo({ id }));
  }

  writeLog(data: Parameters<TypeGRPC.Log['writeLog']>[0]) {
    data.desc = JSON.stringify(data.desc);
    return firstValueFrom(this.RPCLog.writeLog(data));
  }

  resourceCount(data: Parameters<TypeGRPC.Stats['count']>[0]) {
    return this.RPCStats.count(data).subscribe();
  }
}
