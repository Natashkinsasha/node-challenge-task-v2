import { Injectable } from "@nestjs/common";
import { TokenInfo } from "../dto/token-info";
import { TokenPrice } from "../../infrastructure/model/token-price";
import { TokenPriceAdapter } from "../../infrastructure/adapter/token-price/token-price.adapter";

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
      })
    );
  }
}
