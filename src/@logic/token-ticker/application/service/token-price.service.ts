import { Injectable } from '@nestjs/common';

import { TokenPriceAdapter } from '../../infrastructure/adapter/token-price/token-price.adapter';
import { TokenPrice } from '../../infrastructure/model/token-price';
import { TokenInfo } from '../dto/token-info';

@Injectable()
export class TokenPriceService {
  private readonly adapters: TokenPriceAdapter[] = [];

  public register(adapter: TokenPriceAdapter) {
    return this.adapters.push(adapter);
  }

  public getPrice(tokenInfo: TokenInfo): Promise<ReadonlyArray<TokenPrice>> {
    return Promise.all(
      this.adapters.map((adapter) => {
        return adapter.getPrice(tokenInfo);
      }),
    );
  }
}
