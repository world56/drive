import { join } from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.connectMicroservice({
    name: 'GRPC_EXPLORER',
    transport: Transport.GRPC,
    options: {
      package: 'explorer',
      url: '0.0.0.0:9001',
      protoPath: join(__dirname, '../../proto/explorer.proto'),
    },
  });
  app.enableCors();
  app.useStaticAssets({
    prefix: '/resource/',
    root: app.get(ConfigService).get('STORAGE_PATH'),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('Explorer 资源管理服务')
    .setDescription('包涵资源管理、资源收藏等服务。')
    .setVersion(require('../package.json').version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.register(multipart);
  app.listen(process.env.PORT);
  app.startAllMicroservices();
}

bootstrap();
