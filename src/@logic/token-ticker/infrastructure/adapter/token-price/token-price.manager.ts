import { Injectable } from "@nestjs/common";
import { TokenInfo } from "../../../application/dto/token-info";
import { TokenPrice } from "../../../application/dto/token-price";
import { TokenPriceAdapter } from "./token-price.adapter";

@Injectable()
export class TokenPriceManager {
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
