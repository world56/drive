import { Prisma } from '@prisma/client';
import * as AsyncLock from 'async-lock';
import { FileService } from '@/common/file/file.service';
import { RedisService } from '@/common/redis/redis.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ResourceDTO } from '@/dto/resource.dto';
import { MoveResourcesDTO } from './dto/move-resources.dto';
import { InsertResourceDTO } from './dto/inset-resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';

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
export class ResourcesService {
  public constructor(
    private readonly FileService: FileService,
    private readonly RedisService: RedisService,
    private readonly PrismaService: PrismaService,
  ) {}

  private readonly lock = new AsyncLock();

  async findList(id: string) {
    const where = id ? { parentId: id } : { parentId: { equals: null } };
    const [folders, files] = await Promise.all([
      this.PrismaService.resource.findMany({
        orderBy: { createTime: 'desc' },
        include: { _count: { select: { children: true } } },
        where: { ...where, type: ENUM_RESOURCE.TYPE.FOLDER },
      }),
      this.PrismaService.resource.findMany({
        orderBy: { createTime: 'desc' },
        where: {
          ...where,
          type: { not: ENUM_RESOURCE.TYPE.FOLDER },
        },
      }),
    ]);
    return {
      folders: folders.map(({ _count, ...v }) => ({
        ...v,
        size: _count.children,
      })),
      files,
    };
  }

  findFolders() {
    return this.PrismaService.resource.findMany({
      where: { type: ENUM_RESOURCE.TYPE.FOLDER },
      orderBy: { createTime: 'asc' },
    });
  }

  async getDetails(id: string) {
    const [data, paths] = await Promise.all([
      this.PrismaService.resource.findUnique({ where: { id } }),
      this.findPaths({ id }),
    ]);
    return { ...data, paths };
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

  async update(body: ResourceDTO) {
    const { id, ...data } = body;
    const target = await this.PrismaService.resource.findUnique({
      where: { id },
      select: { suffix: true },
    });
    data.remark = data.remark ? data.remark : null;
    data.parentId = data.parentId ? data.parentId : null;
    return await this.PrismaService.resource.update({
      where: { id },
      data: { ...data, fullName: `${data.name}.${target.suffix}` },
    });
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
    const { name, url, suffix } = await this.PrismaService.resource.findUnique({
      where: { id },
      select: { name: true, url: true, suffix: true },
    });
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
