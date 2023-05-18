import { createHash } from 'crypto';
import * as NodeRSA from 'node-rsa';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';

type TypeRSAField = 'public' | 'private';

@Injectable()
export class CryptoService {
  public constructor(private readonly RedisService: RedisService) {}

  async get(type: TypeRSAField) {
    const rsa = await this.RedisService.exists('drive:rsa');
    rsa || (await this.createRSA());
    return await this.RedisService.hget('drive:rsa', type);
  }

  private async createRSA() {
    const RSA = new NodeRSA({ b: 1024 });
    RSA.setOptions({ encryptionScheme: 'pkcs1' });
    const param = {
      public: RSA.exportKey('pkcs8-public-pem'),
      private: RSA.exportKey('pkcs8-private-pem'),
    };
    const secretKey = await this.RedisService.hset('drive:rsa', param);
    await this.RedisService.expire('drive:rsa', 86400);
    return secretKey;
  }

  async decrypt(text: string) {
    const key = await this.get('private');
    const RSA = new NodeRSA(key, 'pkcs8-private-pem');
    RSA.setOptions({ encryptionScheme: 'pkcs1' });
    return RSA.decrypt(text, 'utf8');
  }

  md5(text: string | number, salty: string = 'SALTY_RSA') {
    return createHash('md5').update(`${text}:${salty}`).digest('hex');
  }
}
