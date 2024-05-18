import { Prisma } from '@prisma/client';
import * as AsyncLock from 'async-lock';
import { GrpcService } from '@/common/grpc/grpc.service';
import { FileService } from '@/common/file/file.service';
import { RedisService } from '@/common/redis/redis.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ResourceDTO } from '@/dto/resource.dto';
import { MoveResourcesDTO } from './dto/move-resources.dto';
import { InsertResourceDTO } from './dto/inset-resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';
import { FindResourcesAllDTO } from './dto/find-resources-all.dto';
import { FindResourcesListDTO } from './dto/find-resources-list.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';

import type { Resource } from '@prisma/client';
import type { TypeFileWriteParam } from '@/common/file/file.service';
import { ENUM_LOG } from '@/enum/log';

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
    private readonly GrpcService: GrpcService,
    private readonly FileService: FileService,
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
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
      where: { type: ENUM_RESOURCE.TYPE.FOLDER },
      orderBy: { createTime: 'asc' },
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
    const creator = await this.GrpcService.getUserInfo(data.creatorId);
    const { _count, ...info } = data;
    const IS_FOLDER = data.type === ENUM_RESOURCE.TYPE.FOLDER;
    return {
      ...info,
      paths,
      creator,
      size: IS_FOLDER ? _count.children : data.size,
    };
  }

  createFolder(body: InsertResourceDTO, creatorId: string) {
    return this.PrismaService.resource.create({
      data: {
        ...body,
        creatorId,
        fullName: body.name,
        type: ENUM_RESOURCE.TYPE.FOLDER,
      },
    });
  }

  move(body: MoveResourcesDTO) {
    const parentId = body.parentId ? body.parentId : null;
    const ids = body.ids.filter((id) => id !== body.parentId);
    return Promise.all(
      ids.map((id) =>
        this.PrismaService.resource.update({
          where: { id },
          data: { parentId },
        }),
      ),
    );
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
    await this.PrismaService.resource.update({
      where: { id },
      select: { id: true },
      data: { ...data, fullName: `${data.name}.${target.suffix}` },
    });
    console.log('@-data',target);
    
    this.GrpcService.writeLog({
      operatorId,
      desc: JSON.stringify(target),
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
      return { ...res, paths };
    } else {
      return false;
    }
  }

  async delete({ ids }: DeleteResourcesDTO) {
    if (ids.length > 1) {
      const explorers = await this.PrismaService.resource.findMany({
        where: { id: { in: ids } },
        include: { children: true },
      });
      const delExplorers = explorers.filter((v) => !v.children?.length);
      await this.PrismaService.resource.deleteMany({
        where: { id: { in: delExplorers.map((v) => v.id) } },
      });
      return await this.FileService.delete(delExplorers.map((v) => v.path));
    } else {
      const [id] = ids;
      const target = await this.PrismaService.resource.findUnique({
        where: { id },
        include: { children: true },
      });
      if (target.children.length) {
        throw new ConflictException('该文件夹下存在资源，无法删除');
      }
      await this.PrismaService.resource.delete({ where: { id } });
      return await this.FileService.delete([target.path]);
    }
  }

  async download(id: string) {
    const [{ name, url, suffix }] = await Promise.all([
      this.PrismaService.resource.findUnique({
        where: { id },
        select: { name: true, url: true, suffix: true },
      }),
      this.PrismaService.resource.update({
        where: { id },
        data: { count: { increment: 1 } },
      }),
    ]);
    return { path: url.split('/').at(-1), name: `${name}.${suffix}` };
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
            const now = await this.PrismaService.resource.create({
              data: {
                name,
                creatorId,
                parentId: id,
                fullName: name,
                type: ENUM_RESOURCE.TYPE.FOLDER,
              },
            });
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
