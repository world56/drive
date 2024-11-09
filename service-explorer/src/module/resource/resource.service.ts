import { Prisma } from '@prisma/client';
import * as AsyncLock from 'async-lock';
import { Injectable } from '@nestjs/common';
import { FileService } from '@/common/file/file.service';
import { RedisService } from '@/common/redis/redis.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GrpcClientService } from '@/common/grpc-client/grpc-client.service';

import { ResourceDTO } from '@/dto/resource.dto';
import { MoveResourcesDTO } from './dto/move-resources.dto';
import { InsertResourceDTO } from './dto/inset-resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';
import { FindResourcesAllDTO } from './dto/find-resources-all.dto';
import { FindResourcesListDTO } from './dto/find-resources-list.dto';

import { ENUM_LOG } from '@/enum/log';
import { ENUM_RESOURCE } from '@/enum/explorer';

import type { Resource } from '@prisma/client';
import type { TypeFileWriteParam } from '@/common/file/file.service';

export interface TypeUploadChunkInfo extends TypeFileWriteParam {
  creatorId: Resource['creatorId'];
  parentId?: Resource['id'];
}

export interface TypeFindPaths extends Resource {
  paths: Pick<Resource, 'id' | 'name'>[];
}

@Injectable()
export class ResourceService {
  public constructor(
    private readonly FileService: FileService,
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
    private readonly GrpcClientService: GrpcClientService,
  ) {}

  private readonly lock = new AsyncLock();

  async findGlobal(query: FindResourcesAllDTO) {
    const list = await this.PrismaService.resource.findMany({
      select: {
        id: true,
        path: true,
        type: true,
        suffix: true,
        parentId: true,
        fullName: true,
        createTime: true,
      },
      where: {
        remove: { not: true },
        type: { in: query.type },
        creatorId: { in: query.creators },
        fullName: { contains: query.name },
        createTime: { gte: query.startTime, lt: query.endTime },
      },
      orderBy: { createTime: query?.sort },
    });
    return Promise.all(
      list.map(async (v) => ({
        ...v,
        paths: await this.findPaths(v),
      })),
    );
  }

  findFolders() {
    return this.PrismaService.resource.findMany({
      orderBy: { createTime: 'asc' },
      where: { remove: { not: true }, type: ENUM_RESOURCE.TYPE.FOLDER },
    });
  }

  findList({ id, type, order }: FindResourcesListDTO, userId: string) {
    return this.PrismaService.$queryRaw`
      SELECT 
        r.id, 
        r.url,
        r.name, 
        r.path,
        r.type,
        r.suffix,
        r.remark,
        r.full_name AS fullName,
        r.parent_id AS parentId,
        r.creator_id AS creatorId,
        r.create_time AS createTime,
        CASE WHEN f.\`user_id\` IS NOT NULL THEN true ELSE false END AS favorite,
        CASE WHEN 
          r.type = ${ENUM_RESOURCE.TYPE.FOLDER} 
        THEN 
          (SELECT COUNT(c.id) FROM resource AS c WHERE c.parent_id = r.id) 
        ELSE 
          r.size 
        END AS size
      FROM 
        resource AS r
      LEFT OUTER JOIN 
        favorite AS f ON f.\`user_id\` = ${userId} AND f.resource_id = r.id
      WHERE
        r.remove IS FALSE
        AND
        ${Prisma.raw(id ? `parent_id = "${id}"` : `parent_id IS NULL`)}
      ORDER BY 
        ${Prisma.raw(
          `CASE WHEN r.type = 0 THEN 0 ELSE 1 END, ${type} ${order}`,
        )};
    `;
  }

  async getDetails(id: string) {
    const [data, paths] = await Promise.all([
      this.PrismaService.resource.findUnique({
        where: { id },
        include: { _count: { select: { children: true } } },
      }),
      this.findPaths({ id }),
    ]);
    const creator = await this.GrpcClientService.getUserInfo(data.creatorId);
    const { _count, ...info } = data;
    const IS_FOLDER = data.type === ENUM_RESOURCE.TYPE.FOLDER;
    return {
      ...info,
      paths,
      creator,
      size: IS_FOLDER ? _count.children : data.size,
    };
  }

  async createFolder(body: InsertResourceDTO, creatorId: string) {
    const res = await this.PrismaService.resource.create({
      data: {
        ...body,
        creatorId,
        fullName: body.name,
        type: ENUM_RESOURCE.TYPE.FOLDER,
      },
    });
    this.GrpcClientService.resourceCount({ count: 1, type: res.type });
    this.GrpcClientService.writeLog({
      desc: res,
      operatorId: res.creatorId,
      event: ENUM_LOG.EVENT.RESOURCE_MKDIR_FOLDER,
    });
    return res;
  }

  async move(body: MoveResourcesDTO, operatorId: string) {
    const parentId = body.parentId ? body.parentId : null;
    const ids = body.ids.filter((id) => id !== body.parentId);
    const desc = await Promise.all(
      ids.map((id) =>
        this.PrismaService.resource.update({
          where: { id },
          data: { parentId },
          select: {
            id: true,
            path: true,
            name: true,
            type: true,
            suffix: true,
            parentId: true,
            creatorId: true,
            fullName: true,
          },
        }),
      ),
    );
    this.GrpcClientService.writeLog({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.RESOURCE_MOVE,
    });
    return true;
  }

  async update(body: ResourceDTO, operatorId: string) {
    const { id, ...data } = body;
    const target = await this.PrismaService.resource.findUnique({
      where: { id },
      select: {
        id: true,
        suffix: true,
        parentId: true,
        fullName: true,
      },
    });
    data.remark = data.remark ? data.remark : null;
    data.parentId = data.parentId ? data.parentId : null;
    const desc = await this.PrismaService.resource.update({
      where: { id },
      data: {
        ...data,
        fullName: `${data.name}${target.suffix ? `.${target.suffix}` : ''}`,
      },
    });
    this.GrpcClientService.writeLog({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.RESOURCE_UPDATE,
    });
    return true;
  }

  async upload(data: TypeUploadChunkInfo) {
    let { name, creatorId, parentId, path } = data;
    const file = await this.FileService.write(data);
    if (file) {
      if (path) {
        const folders = path.split('/');
        folders.pop();
        parentId = await this.createFolders(folders, parentId, creatorId);
      }
      const res = await this.PrismaService.resource.create({
        data: { ...file, fullName: name, creatorId, parentId },
      });
      const paths = await this.findPaths(res);
      this.GrpcClientService.resourceCount({ count: 1, type: res.type });
      this.GrpcClientService.writeLog({
        desc: res,
        operatorId: res.creatorId,
        event: ENUM_LOG.EVENT.RESOURCE_UPLOAD,
      });
      return { ...res, paths };
    } else {
      return false;
    }
  }

  async delete({ ids }: DeleteResourcesDTO, operatorId: string) {
    return await this.PrismaService.$transaction(async (prisma) => {
      const results: Record<string, string[]> = Object.fromEntries(
        await Promise.all(
          ids.map(async (id) => [
            id,
            (
              await prisma.$queryRaw<{ id: string }[]>`
            WITH RECURSIVE tables AS (
              SELECT
                id, parent_id, type, remove
              FROM
                resource
              WHERE
                id = ${id} AND remove = 0
              UNION ALL
              SELECT
                r.id, r.parent_id, r.type, r.remove
              FROM
                resource AS r
              INNER JOIN
                tables AS t ON r.parent_id = t.id
              WHERE
                r.remove = 0
                AND 
                t.type = ${ENUM_RESOURCE.TYPE.FOLDER} 
            )
            SELECT id FROM tables;`
            ).map((v) => v.id),
          ]),
        ),
      );
      const returnsIds = Object.values(results).flat();
      const [desc] = await Promise.all([
        prisma.resource.findMany({
          where: { id: { in: returnsIds } },
          select: {
            id: true,
            type: true,
            size: true,
            path: true,
            fullName: true,
            parentId: true,
            creatorId: true,
          },
        }),
        prisma.resource.updateMany({
          data: { remove: true },
          where: { id: { in: returnsIds } },
        }),
        ...ids.map((resourceId) =>
          prisma.recycle.create({
            data: {
              resourceId,
              operatorId,
              relations: { connect: results[resourceId].map((id) => ({ id })) },
            },
          }),
        ),
      ]);
      this.syncCount(desc, 'REDUCE');
      this.GrpcClientService.writeLog({
        desc,
        operatorId,
        event: ENUM_LOG.EVENT.RESOURCE_TO_RECYCLE,
      });
      return true;
    });
  }

  async download(id: string, operatorId: string) {
    const [{ name, url, suffix }, desc] = await Promise.all([
      this.PrismaService.resource.findUnique({
        where: { id },
        select: { name: true, url: true, suffix: true },
      }),
      this.PrismaService.resource.update({
        where: { id },
        data: { count: { increment: 1 } },
      }),
    ]);
    this.GrpcClientService.writeLog({
      desc,
      operatorId,
      event: ENUM_LOG.EVENT.RESOURCE_DOWNLOAD,
    });
    return { path: url.split('/').at(-1), name: `${name}.${suffix}` };
  }

  async getCount() {
    const res = await this.PrismaService.resource.groupBy({
      by: ['type'],
      _count: true,
      where: { remove: false },
    });
    return Object.fromEntries(res.map((v) => [v.type, v._count]));
  }

  async getRecently() {
    return this.PrismaService.resource.findMany({
      take: 10,
      where: { remove: false },
      orderBy: { createTime: 'desc' },
      select: { id: true, fullName: true, type: true, path: true },
    });
  }

  async syncCount(resources: Pick<Resource, 'type'>[], type: 'ADD' | 'REDUCE') {
    let count: Record<number, number> = {};
    const length = resources.length;
    for (let i = 0; i < length; i++) {
      const type = resources[i].type;
      count[type] = (count[type] || 0) + 1;
    }
    Object.keys(count).forEach((i) => {
      const num = count[i];
      this.GrpcClientService.resourceCount({
        type: Number(i),
        count: type === 'REDUCE' ? -num : num,
      });
    });
  }

  private async createFolders(
    paths: string[],
    parentId: string | null,
    creatorId: string,
  ) {
    const key = `drive:folder:${parentId}`;
    return await this.lock.acquire(key, async () => {
      let id = parentId;
      for await (const name of paths) {
        const cacheID = await this.RedisService.hget(key, name);
        if (cacheID) {
          id = cacheID;
        } else {
          const target = await this.PrismaService.resource.findFirst({
            where: { name, parentId: id },
          });
          if (target?.id) {
            id = target.id;
          } else {
            const now = await this.createFolder(
              { name, parentId: id },
              creatorId,
            );
            id = now.id;
          }
        }
        await this.RedisService.hset(key, name, id);
      }
      await this.RedisService.expire(key, 60);
      return id;
    });
  }

  private async findPaths(resource: Pick<Resource, 'id'>) {
    try {
      const list = await this.PrismaService.$queryRaw<TypeFindPaths['paths']>(
        Prisma.sql`
          WITH RECURSIVE ids AS (
            SELECT id, name, parent_id FROM resource WHERE id = ${resource.id}
            UNION ALL
            SELECT e.id, e.name, e.parent_id FROM resource as e JOIN ids AS s WHERE s.parent_id = e.id
          )
          SELECT id, name FROM ids;
        `,
      );
      return list.splice(1).reverse();
    } catch (error) {
      return [];
    }
  }
}
