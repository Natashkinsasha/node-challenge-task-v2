import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { TokenInfo } from '../../../application/dto/token-info';
import { TokenPriceService } from '../../../application/service/token-price.service';
import { TokenPrice } from '../../model/token-price';

@Injectable()
export abstract class TokenPriceAdapter implements OnModuleInit {
  @Inject() private readonly tokenPriceManager!: TokenPriceService;

  public abstract getPrice(tokenInfo: TokenInfo): Promise<TokenPrice>;

  protected abstract getSource(): string;

  onModuleInit(): void {
    this.tokenPriceManager.register(this);
  }
}
