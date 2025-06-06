import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcClientService } from './grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_AUTH',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          url: '0.0.0.0:9002',
          maxMetadataSize: 10240,
          protoPath: join(__dirname, '../../../../proto/auth.proto'),
        },
      },
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
  controllers: [],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}
