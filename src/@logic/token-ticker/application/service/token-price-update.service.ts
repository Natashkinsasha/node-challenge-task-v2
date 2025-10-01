import { Injectable } from "@nestjs/common";
import { Transaction } from "../../../../@shared/shared-cls/transaction";
import { TokenPriceManager } from "../../infrastructure/adapter/token-price/token-price.manager";
import { TokenPriceTickDao } from "../../infrastructure/dao/token-price-tick.dao";
import { TokenRepository } from "../../infrastructure/repository/token.repository";

@Injectable()
export class TokenPriceUpdateService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly tokenPriceManager: TokenPriceManager,
    private readonly tokenPriceTickDao: TokenPriceTickDao
  ) {}

  @Transaction()
  public async updateTokenPrice(tokenId: string): Promise<void> {
    const token = await this.tokenRepository.findById(tokenId);
    if (!token) {
      throw new Error("Token not found");
    }
    const prices = await this.tokenPriceManager.getPrice(token.getTokenInfo());

    await Promise.all(
      prices.map((price) => {
        return this.tokenPriceTickDao.upsert({
          tokenId: token.getId(),
          source: "Mock",
          price: price.value,
          updatedAt: price.date,
        });
      })
    );
  }
}
