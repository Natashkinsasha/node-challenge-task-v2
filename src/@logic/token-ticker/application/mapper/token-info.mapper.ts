import { Injectable } from '@nestjs/common';

import { TokenInfo, tokenInfoSchema } from '../dto/token-info';

@Injectable()
export class TokenInfoMapper {
  static toTokenInfo(info: TokenInfo) {
    return tokenInfoSchema.parse({
      address: info.address,
      debridgeId: info.debridgeId,
    });
  }
}
