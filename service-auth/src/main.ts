import { join } from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { MicroserviceOptions } from '@nestjs/microservices';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      url: '0.0.0.0:9002',
      maxMetadataSize: 10240,
      protoPath: join(__dirname, '../../proto/auth.proto'),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Auth 授权中心')
    .setDescription('主要用于处理身份验证、授权、访问控制、日志等相关服务。')
    .setVersion(require('../package.json').version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.startAllMicroservices();
  app.listen(process.env.PORT);
}

bootstrap();
