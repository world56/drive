import { CryptoService } from '@/module/crypto/crypto.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecryptContextPipe<T extends string> implements PipeTransform {
  public constructor(private readonly EncryptionService?: CryptoService) {}

  public async transform(value: T, metadata: ArgumentMetadata) {
    if (value) {
      const data = await this.EncryptionService.decrypt(value);
      return JSON.parse(data);
    }
    return value;
  }
}
