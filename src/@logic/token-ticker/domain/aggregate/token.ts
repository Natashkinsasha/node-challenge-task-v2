import { TokenInfo, TokenInfoSchema } from "../../application/dto/token-info";
import { TokenWithChain } from "../../infrastructure/model/token-with-chain";

export class Token {
  constructor(private readonly tokenWithChain: TokenWithChain) {}


    public getId(): string{
      return this.tokenWithChain.id;
    }

  public getTokenInfo(): TokenInfo {
    return TokenInfoSchema.parse({
      address: this.tokenWithChain.address,
      debridgeId: this.tokenWithChain.chain.debridgeId,
    });
  }
}
