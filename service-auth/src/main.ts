import { join } from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { GrpcModule } from './common/grpc/grpc.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { MicroserviceOptions } from '@nestjs/microservices';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const [app, grpc] = await Promise.all([
    NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter()),
    NestFactory.createMicroservice<MicroserviceOptions>(GrpcModule, {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../../proto/user.proto'),
      },
    }),
  ]);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  grpc.listen();
  app.listen(process.env.PORT);
  const config = new DocumentBuilder()
    .setTitle('Auth 授权中心')
    .setDescription('主要用于处理身份验证、授权、访问控制、日志等相关服务。')
    .setVersion(require('../package.json').version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
