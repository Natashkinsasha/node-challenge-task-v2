import { Injectable } from '@nestjs/common';

import { InsertToken } from '../../infrastructure/model/insert-token';
import { TokenRepository } from '../../infrastructure/repository/token.repository';

@Injectable()
export class TokenMaintainer {
  constructor(private readonly tokenRepository: TokenRepository) {}

  public async createToken(insertToken: InsertToken) {
    return {
      token: await this.tokenRepository.upsert(insertToken),
    };
  }
}
