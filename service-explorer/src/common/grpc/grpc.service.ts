import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import type { Observable } from 'rxjs';
import type { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';

namespace TypeGRPC {
  export interface TypeUserService {
    getUserInfo(params: {
      id: string;
    }): Observable<Record<'id' | 'name', string>>;
  }
}

@Injectable()
export class GrpcService implements OnModuleInit {
  private UserService: TypeGRPC.TypeUserService;

  public constructor(
    @Inject('GRPC_USER') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.UserService =
      this.client.getService<TypeGRPC.TypeUserService>('UserService');
  }

  getUserInfo(id: string) {
    return firstValueFrom(this.UserService.getUserInfo({ id }));
  }
}
