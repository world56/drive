import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { FavoritesRemoveDTO } from './dto/favorites-remove.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';

@Injectable()
export class FavoritesService {
  public constructor(private readonly PrismaService: PrismaService) {}

  async findList(userId: string) {
    const res = await this.PrismaService.favorite.findMany({
      where: { userId },
      select: { resourceId: true },
    });
    const ids = res.map((v) => v.resourceId);
    const [list, count] = await Promise.all([
      this.PrismaService.resource.findMany({
        where: { id: { in: ids } },
        orderBy: { createTime: 'desc' },
        include: { _count: { select: { children: true } } },
      }),
      this.PrismaService.resource.count({ where: { id: { in: ids } } }),
    ]);
    return {
      count,
      list: list.map((v) => {
        const IS_FOLDER = v.type === ENUM_RESOURCE.TYPE.FOLDER;
        return { ...v, size: IS_FOLDER ? v._count.children : v.size };
      }),
    };
  }

  async insert(resourceId: string, userId: string) {
    const target = await this.PrismaService.favorite.findFirst({
      where: { userId, resourceId },
    });
    if (!target) {
      await this.PrismaService.favorite.create({
        data: { userId, resourceId },
      });
    }
    return true;
  }

  async remove({ ids }: FavoritesRemoveDTO) {
    await this.PrismaService.favorite.deleteMany({
      where: { id: { in: ids } },
    });
    return true;
  }
}
