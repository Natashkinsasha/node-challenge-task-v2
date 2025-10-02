import { Injectable } from "@nestjs/common";
import { Transaction } from "../../../../@shared/shared-cls/transaction";
import { TokenPriceService } from "./token-price.service";
import { TokenPriceTickDao } from "../../infrastructure/dao/token-price-tick.dao";
import { TokenDao } from "../../infrastructure/dao/token.dao";
import { TokenInfoMapper } from "../mapper/token-info.mapper";

@Injectable()
export class TokenPriceUpdateService {
  constructor(
    private readonly tokenDao: TokenDao,
    private readonly tokenPriceManager: TokenPriceService,
    private readonly tokenPriceTickDao: TokenPriceTickDao
  ) {}

  @Transaction()
  public async updateTokenPrice(tokenId: string): Promise<void> {
    const tokenWithChain = await this.tokenDao.findById(tokenId);
    if (!tokenWithChain) {
      throw new Error("Token not found");
    }
    const tokenInfo = TokenInfoMapper.toTokenInfo({
      address: tokenWithChain.address,
      debridgeId: tokenWithChain.chain.debridgeId,
    });
    const prices = await this.tokenPriceManager.getPrice(tokenInfo);

    await Promise.all(
      prices.map((price) => {
        return this.tokenPriceTickDao.upsert({
          tokenId: tokenWithChain.id,
          source: "Mock",
          price: price.value,
          updatedAt: price.date,
        });
      })
    );
  }
}
