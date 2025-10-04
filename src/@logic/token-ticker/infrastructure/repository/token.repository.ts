import { Injectable } from '@nestjs/common';

import { Transaction } from '../../../../@shared/shared-cls/transaction';
import { EventService } from '../../application/service/event.service';
import { TokenDao } from '../dao/token.dao';
import { CreateTokenPayload } from '../kafka-message-payload/create-token.payload';
import { InsertToken } from '../model/insert-token';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly eventService: EventService,
    private readonly tokenDao: TokenDao,
  ) {}

  @Transaction()
  public async upsert(data: InsertToken) {
    const token = await this.tokenDao.upsert(data);
    if (token.isInserted) {
      await this.eventService.send<CreateTokenPayload>({
        aggregateType: 'token',
        aggregateId: token.id,
        type: 'token.create',
        payload: { tokenId: token.id },
      });
    }
    return token;
  }
}
