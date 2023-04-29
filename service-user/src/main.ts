import { join } from 'path';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import type { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const [app, Microservice] = await Promise.all([
    NestFactory.create(AppModule),
    NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'hero',
        protoPath: join(__dirname, 'hero/hero.proto'),
      },
    }),
  ]);
  await Promise.all([app.listen(2001), Microservice.listen()]);
};

bootstrap();
