import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { FindLogListDTO } from './dto/find-log-list.dto';

import type { Log } from '@prisma/client';

@Injectable()
export class LogService {
  public constructor(private readonly PrismaService: PrismaService) {}

  async getList({ take, skip, event, operatorId }: FindLogListDTO) {
    const where = { event, operatorId };
    const [count, list] = await Promise.all([
      this.PrismaService.log.count({ where }),
      this.PrismaService.log.findMany({
        take,
        skip,
        where,
        include: { operator: { select: { id: true, name: true } } },
      }),
    ]);
    return { count, list };
  }

  async write(data: Pick<Log, 'desc' | 'event' | 'operatorId'>) {
    return await this.PrismaService.log.create({ data });
  }
}
