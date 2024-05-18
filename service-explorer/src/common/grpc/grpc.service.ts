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
      desc: string;
      operatorId: string;
    }): Observable<void>;
  }
}

@Injectable()
export class GrpcService implements OnModuleInit {
  private AuthLogRPC: TypeGRPC.Log;
  private AuthUserRPC: TypeGRPC.User;

  public constructor(
    @Inject('GRPC_AUTH') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.AuthLogRPC = this.client.getService<TypeGRPC.Log>('LogService');
    this.AuthUserRPC = this.client.getService<TypeGRPC.User>('UserService');
  }

  getUserInfo(id: string) {
    return firstValueFrom(this.AuthUserRPC.getUserInfo({ id }));
  }

  writeLog(data: Parameters<TypeGRPC.Log['writeLog']>[0]) {
    return firstValueFrom(this.AuthLogRPC.writeLog(data));
  }
}
