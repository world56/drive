import { Injectable } from '@nestjs/common';
import { CryptoService } from '@/module/crypto/crypto.service';

import { UserDTO } from '@/dto/user.dto';

import type { PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DecryptPasswordPipe implements PipeTransform {
  public constructor(private readonly EncryptionService?: CryptoService) {}

  public async transform(value: UserDTO, metadata: ArgumentMetadata) {
    if (value) {
      const pwd = await this.EncryptionService.decrypt(value['password']);
      value['password'] = JSON.parse(pwd);;
    }
    return value;
  }
}
