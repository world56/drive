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

import { ENUM_RESOURCE } from '@/enum/explorer';

import type { WriteStream } from 'fs';
import type { MultipartFile } from '@fastify/multipart';

export interface TypeFileWriteParam
  extends Record<
    'id' | 'name' | 'index' | 'total' | 'segment' | 'path',
    string
  > {
  size: number;
  file: MultipartFile['file'];
}

@Injectable()
export class FileService {
  private RESOURCE_PATH: string;

  private readonly open = promisify(open);
  private readonly pump = promisify(pipeline);
  private readonly ftruncate = promisify(ftruncate);

  public constructor(
    private readonly ConfigService: ConfigService<
      ReturnType<typeof CONFIG_FILE_TYPE> & Record<string, string>
    >,
  ) {
    this.RESOURCE_PATH = this.ConfigService.get<string>('STORAGE_PATH');
  }

  private getPath(id: string, name: string) {
    const storageName = `${id}${name.length}${extname(name)}`;
    return { path: `/${storageName}`, url: `/resource/${storageName}` };
  }

  private getType(suffix: string) {
    const type = this.ConfigService.get('FILE_TYPE')[suffix];
    return type !== undefined ? type : ENUM_RESOURCE.TYPE.OTHER;
  }

  async write(body: TypeFileWriteParam) {
    const { id, name, file, size, index, total, segment } = body;
    let target: number, write: WriteStream;
    try {
      const { path, url } = this.getPath(id, name);
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
          type: this.getType(suffix),
          name: name.slice(0, name.indexOf(suffixName)) || name,
        };
      }
      return false;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      if (write) {
        write.close();
        close(target);
      }
    }
  }

  async delete(paths: string[]) {
    try {
      paths?.forEach((p) => {
        if (p) {
          const path = `${this.RESOURCE_PATH}/${p}`;
          stat(path, (e, s) => s?.isFile() && unlink(path, () => {}));
        }
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
