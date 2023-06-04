import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
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
  app.useStaticAssets({
    prefix: '/resource/',
    root: app.get(ConfigService).get('STORAGE_PATH'),
  });
  app.register(multipart);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.listen(process.env.PORT);
  const config = new DocumentBuilder()
    .setTitle('Explorer 资源管理服务')
    .setDescription('包涵文件、文件夹、统计、收藏等服务。')
    .setVersion(require('../package.json').version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
