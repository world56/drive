import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

import type { INestApplication, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  constructor() {
    super(process.env.DATABASE_REDIS);
  }

  async onModuleInit() {}

  async enableShutdownHooks(app: INestApplication) {
    await app.close();
  }
}
