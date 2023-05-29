import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { ResourceDTO } from 'src/dto/resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';

import { ENUM_EXPLORER } from 'src/enum/explorer';

@Injectable()
export class ResourcesService {
  public constructor(private readonly PrismaService: PrismaService) {}

  findList(id: string) {
    return this.PrismaService.resource.findMany({
      where: { parentId: id },
    });
  }

  findFolders() {
    return this.PrismaService.resource.findMany({
      where: { type: ENUM_EXPLORER.TYPE.FOLDER },
      orderBy: { createTime: 'asc' },
    });
  }

  createFolder(body: ResourceDTO, creatorId: string) {
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
}
