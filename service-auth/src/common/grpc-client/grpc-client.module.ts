import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_STATS',
        transport: Transport.GRPC,
        options: {
          package: 'stats',
          url: '0.0.0.0:9003',
          protoPath: join(__dirname, '../../../../proto/stats.proto'),
        },
      },
    ]),
  ],
  exports: [GrpcClientService],
  providers: [GrpcClientService],
})
export class GrpcClientModule {}
