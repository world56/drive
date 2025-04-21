import { Injectable } from '@nestjs/common';
import { FileService } from '@/common/file/file.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ResourceService } from '../resource/resource.service';
import { GrpcClientService } from '@/common/grpc-client/grpc-client.service';

import { RecycleUpdateDTO } from './dto/recycle-update.dto';

import { ENUM_LOG } from '@/enum/log';

@Injectable()
export class RecycleService {
  constructor(
    private readonly FileService: FileService,
    private readonly PrismaService: PrismaService,
    private readonly ResourceService: ResourceService,
    private readonly GrpcClientService: GrpcClientService,
  ) {}

  async getList() {
    const list = await this.PrismaService.recycle.findMany({
      include: { resource: true },
      orderBy: { createTime: 'asc' },
    });
    let operatorMap: Record<string, object> = {};
    let returns: Array<(typeof list)[0] & Record<'operator', object>> = [];
    for await (const v of list) {
      if (!operatorMap[v.operatorId]) {
        operatorMap[v.operatorId] = await this.GrpcClientService.getUserInfo(
          v.operatorId,
        );
      }
      returns.push({ ...v, operator: operatorMap[v.operatorId] });
    }
    return returns;
  }

  async recover({ ids }: RecycleUpdateDTO, operatorId: string) {
    return this.PrismaService.$transaction(async (prisma) => {
      const desc = await prisma.recycle.findMany({
        where: { id: { in: ids } },
        select: { relations: { select: { id: true, path: true, type: true } } },
      });
      await Promise.all([
        prisma.recycle.deleteMany({ where: { id: { in: ids } } }),
        prisma.resource.updateMany({
          data: { remove: false },
          where: {
            id: { in: desc.map((v) => v.relations.map((v) => v.id)).flat() },
          },
        }),
      ]);
      this.ResourceService.syncCount(
        desc.map((v) => v.relations).flat(),
        'ADD',
      );
      this.GrpcClientService.writeLog({
        desc,
        operatorId,
        event: ENUM_LOG.EVENT.RECYCLE_BIN_RECOVERY,
      });
      return true;
    });
  }

  async remove({ ids }: RecycleUpdateDTO, operatorId: string) {
    return this.PrismaService.$transaction(async (prisma) => {
      const desc = await prisma.recycle.findMany({
        where: { id: { in: ids } },
        select: {
          operatorId: true,
          relations: {
            select: {
              id: true,
              path: true,
              type: true,
              fullName: true,
              parentId: true,
              creatorId: true,
            },
          },
        },
      });
      const paths: string[] = [];
      const resourceIds: string[] = desc
        .map((v) =>
          v.relations.map((v) => {
            v.path && paths.push(v.path);
            return v.id;
          }),
        )
        .flat();
      await Promise.all([
        prisma.recycle.deleteMany({ where: { id: { in: ids } } }),
        prisma.resource.deleteMany({ where: { id: { in: resourceIds } } }),
      ]);
      this.FileService.delete(paths);
      this.GrpcClientService.writeLog({
        desc,
        operatorId,
        event: ENUM_LOG.EVENT.RECYCLE_BIN_DELETE,
      });
      return true;
    });
  }
}
