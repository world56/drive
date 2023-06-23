import { Prisma } from '@prisma/client';
import { FileService } from '@/common/file/file.service';
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ResourceDTO } from '@/dto/resource.dto';
import { InsertResourceDTO } from './dto/inset-resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';

import { ENUM_EXPLORER } from '@/enum/explorer';

import type { Resource } from '@prisma/client';
import type { TypeFileWriteParam } from '@/common/file/file.service';

export interface TypeUploadChunkInfo extends TypeFileWriteParam {
  creatorId: Resource['creatorId'];
}

export interface TypeFindPaths extends Resource {
  paths: Pick<Resource, 'id' | 'name'>[];
}

@Injectable()
export class ResourcesService {
  public constructor(
    private readonly FileService: FileService,
    private readonly PrismaService: PrismaService,
  ) {}

  findList(id: string) {
    return this.PrismaService.resource.findMany({
      where: id ? { parentId: id } : { parentId: { equals: null } },
    });
  }

  findFolders() {
    return this.PrismaService.resource.findMany({
      where: { type: ENUM_EXPLORER.TYPE.FOLDER },
      orderBy: { createTime: 'asc' },
    });
  }

  createFolder(body: InsertResourceDTO, creatorId: string) {
    return this.PrismaService.resource.create({
      data: {
        ...body,
        creatorId,
        fullName: body.name,
        type: ENUM_EXPLORER.TYPE.FOLDER,
      },
    });
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

  async upload(data: TypeUploadChunkInfo, creatorId: string) {
    const { name } = data;
    const file = await this.FileService.write(data);
    if (file) {
      const res = await this.PrismaService.resource.create({
        data: { ...file, fullName: name, creatorId },
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
      return true;
      // return await this.FileService.delete(delExplorers.map((v) => v.path));
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
      return true;
      // return await this.FileService.delete([target.path]);
    }
  }

  private async findPaths(resource: Resource) {
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
