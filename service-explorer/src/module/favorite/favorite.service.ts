import { Injectable } from '@nestjs/common';
import { UtilsService } from '@/common/utils/utils.service';
import { PrismaService } from '@/common/prisma/prisma.service';

import { FavoritesUpdateDTO } from './dto/favorites-update.dto';
import { FavoriteFindListDTO } from './dto/favorite-find-list.dto';

import { ENUM_RESOURCE } from '@/enum/explorer';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoriteService {
  public constructor(
    private readonly UtilsService: UtilsService,
    private readonly PrismaService: PrismaService,
  ) {}

  findList(query: FavoriteFindListDTO, userId: string) {
    const { name = '', type, createTime } = query;
    return this.PrismaService.$queryRaw`
      SELECT
        r.id, 
        r.url,
        r.path,
        r.type,
        r.suffix,
        f.id AS favoriteId, 
        r.full_name AS name,
        f.favorite_time AS createTime,
        CASE WHEN
          r.type = ${ENUM_RESOURCE.TYPE.FOLDER}
        THEN
          (SELECT COUNT(c.id) FROM resource AS c WHERE c.parent_id = r.id)
        ELSE 
          r.size
        END AS size
      FROM 
        favorite AS f 
      INNER JOIN
        resource AS r ON f.resource_id = r.id AND f.user_id = ${userId}
      WHERE
        ${Prisma.raw(
          name ? `r.full_name LIKE '%${name}%'` : 'r.full_name IS NOT NULL',
        )}
        ${Prisma.raw(
          type?.length ? `AND r.type IN(${type?.toString() || ''})` : '',
        )}
      ORDER BY 
        ${Prisma.raw(`f.favorite_time ${createTime}`)}
    `;
  }

  async insert({ ids }: FavoritesUpdateDTO, userId: string) {
    const res = await this.PrismaService.favorite.findMany({
      where: { resourceId: { in: ids } },
    });
    const INSERT = this.UtilsService.filterInsert(
      ids,
      res.map((v) => v.id),
    );
    if (INSERT.length) {
      await this.PrismaService.favorite.createMany({
        data: INSERT.map((id) => ({ resourceId: id, userId })),
      });
    }
    return true;
  }

  async remove({ ids }: FavoritesUpdateDTO) {
    await this.PrismaService.favorite.deleteMany({
      where: { resourceId: { in: ids } },
    });
    return true;
  }
}
