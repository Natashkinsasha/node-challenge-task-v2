import { Injectable } from "@nestjs/common";
import { TokenInfo } from "../../../application/dto/token-info";
import { TokenPrice } from "../../../application/dto/token-price";
import { TokenPriceAdapter } from "./token-price.adapter";

@Injectable()
export class MockTokenPriceAdapter extends TokenPriceAdapter {
  async getPrice(_token: TokenInfo): Promise<TokenPrice> {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.getRandomInt(50, 200));
    });

    const basePrice = this.getRandomInt(1, 100000);
    const randomFactor = Math.random() * 10;

    return { value: basePrice * randomFactor, date: new Date() };
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  protected getSource(): string {
    return "Mock";
  }
}
