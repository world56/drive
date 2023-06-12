import {
  open,
  stat,
  close,
  unlink,
  ftruncate,
  createReadStream,
  createWriteStream,
} from 'fs';
import { extname } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import CONFIG_FILE_TYPE from '@/config/file-type.config';

import { ENUM_EXPLORER } from '@/enum/explorer';

import type { WriteStream } from 'fs';
import type { Resource } from '@prisma/client';
import type { MultipartFile } from '@fastify/multipart';

export interface TypeFileWriteParam
  extends Record<'id' | 'name' | 'index' | 'total' | 'segment', string> {
  size: number;
  parentId?: Resource['id'];
  file: MultipartFile['file'];
}

@Injectable()
export class FileService {
  constructor(
    private readonly ConfigService: ConfigService<
      ReturnType<typeof CONFIG_FILE_TYPE> & Record<string, string>
    >,
  ) {
    this.RESOURCE_PATH = this.ConfigService.get<string>('STORAGE_PATH');
  }

  private RESOURCE_PATH: string;

  private readonly open = promisify(open);
  private readonly pump = promisify(pipeline);
  private readonly ftruncate = promisify(ftruncate);

  private getFilePath(id: string, name: string) {
    const storageName = `${id}${name.length}${extname(name)}`;
    return { path: `/${storageName}`, url: `/resource/${storageName}` };
  }

  private getFileType(suffix: string) {
    const type =
      this.ConfigService.get<ENUM_EXPLORER.TYPE>('FILE_TYPE')[suffix];
    return type !== undefined ? type : ENUM_EXPLORER.TYPE.OTHER;
  }

  async write(body: TypeFileWriteParam) {
    const { id, name, file, size, index, total, segment, parentId } = body;
    let target: number, write: WriteStream;
    try {
      const { path, url } = this.getFilePath(id, name);
      const storage = `${this.RESOURCE_PATH}${path}`;
      target = await this.open(storage, 'a');
      await this.ftruncate(target, Number(segment));
      write = createWriteStream(storage, { flags: 'a' });
      await this.pump(file, write);
      if (index === total) {
        const suffixName = extname(name);
        const suffix = suffixName.toLocaleLowerCase().split('.').pop();
        return {
          url,
          size,
          path,
          suffix,
          parentId,
          type: this.getFileType(suffix),
          name: name.slice(0, name.indexOf(suffixName)),
        };
      }
      return false;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      write.close();
      close(target);
    }
  }

  async delete(paths: string[]) {
    try {
      paths?.forEach((p) => {
        const path = `${this.RESOURCE_PATH}/${p}`;
        stat(path, (e, s) => s?.isFile() && unlink(path, () => {}));
      });
      return true;
    } catch (error) {
      return Promise.reject(false);
    }
  }

  read(path: string) {
    return createReadStream(path, { autoClose: true });
  }
}
