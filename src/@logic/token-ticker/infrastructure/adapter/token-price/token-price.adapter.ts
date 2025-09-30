import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { TokenInfo } from "../../../application/dto/token-info";
import { TokenPrice } from "../../../application/dto/token-price";
import { TokenPriceManager } from "./token-price.manager";

@Injectable()
export abstract class TokenPriceAdapter implements OnModuleInit {
  @Inject() private readonly tokenPriceManager!: TokenPriceManager;

  public abstract getPrice(tokenInfo: TokenInfo): Promise<TokenPrice>;

  protected abstract getSource(): string;

  onModuleInit(): void {
    this.tokenPriceManager.register(this);
  }
}
