import { Injectable } from "@nestjs/common";
import { Transaction } from "../../../../@shared/shared-cls/transaction";
import { EventService } from "../../application/service/event.service";
import { CreateTokenConsumer } from "../consumer/create-token.consumer";
import { TokenDao } from "../dao/token.dao";
import { InsertToken } from "../model/insert-token";

@Injectable()
export class TokenRepository {
  constructor(
    private readonly eventService: EventService,
    private readonly tokenDao: TokenDao,
    private readonly createTokenConsumer: CreateTokenConsumer
  ) {}

  @Transaction()
  public async upsert(data: InsertToken) {
    const token = await this.tokenDao.upsert(data);
    if (token.isInserted) {
      await this.eventService.send({
        aggregateType: "token",
        aggregateId: token.id,
        type: "token.create",
        payload: { id: token.id, symbol: token.symbol, chainId: token.chainId },
      });
      await this.createTokenConsumer.handlerTokenCreate(token.id);
    }
    return token;
  }
}
