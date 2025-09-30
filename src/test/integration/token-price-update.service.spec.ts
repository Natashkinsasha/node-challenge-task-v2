import { Test, TestingModule } from "@nestjs/testing";
import { mock, mockDeep, DeepMockProxy } from "jest-mock-extended";
import { TokenPriceUpdateService } from "../../@logic/token-ticker/application/service/token-price-update.service";
import { TokenRepository } from "../../@logic/token-ticker/infrastructure/repository/token.repository";
import { TokenPriceTickDao } from "../../@logic/token-ticker/infrastructure/dao/token-price-tick.dao";
import { Token } from "../../@logic/token-ticker/domain/aggregate/token";
import { TokenPriceManager } from "../../@logic/token-ticker/infrastructure/adapter/token-price/token-price.manager";
import { TokenPriceAdapter } from "../../@logic/token-ticker/infrastructure/adapter/token-price/token-price.adapter";
import { TokenInfo } from "../../@logic/token-ticker/application/dto/token-info";

const makeToken = (params?: {
  id?: string;
  address?: string;
  debridgeId?: number;
}): Token => {
  const { id = "token-1", address = "0xABC", debridgeId = 1 } = params ?? {};
  const t = mock<Token>();
  t.getId.mockReturnValue(id);
  t.getTokenInfo.mockReturnValue({ address, debridgeId });
  return t;
};

class TestTokenPriceAdapter extends TokenPriceAdapter {
  private readonly fixedDate = new Date("2023-01-01T00:00:00.000Z");
  private readonly fixedValue = "1.23";
  async getPrice(_token: TokenInfo) {
    return { value: this.fixedValue, date: this.fixedDate };
  }
  protected getSource(): string {
    return "Mock";
  }
}

describe("TokenPriceUpdateService", () => {
  let moduleRef: TestingModule;
  let service: TokenPriceUpdateService;
  let tokenRepository: DeepMockProxy<TokenRepository>;
  let tokenPriceTickDao: DeepMockProxy<TokenPriceTickDao>;

  beforeEach(async () => {
    tokenRepository = mockDeep<TokenRepository>();
    tokenPriceTickDao = mockDeep<TokenPriceTickDao>();

    moduleRef = await Test.createTestingModule({
      providers: [
        TokenPriceUpdateService,
        TokenPriceManager,
        { provide: TokenRepository, useValue: tokenRepository },
        { provide: TokenPriceTickDao, useValue: tokenPriceTickDao },
        TestTokenPriceAdapter,
      ],
    }).compile();

    await moduleRef.init();

    service = moduleRef.get(TokenPriceUpdateService);
  });

  it("throws if token not found", async () => {
    tokenRepository.findById.mockResolvedValueOnce(undefined);

    await expect(service.updateTokenPrice("missing-id")).rejects.toThrow(
      "Token not found"
    );
    expect(tokenPriceTickDao.upsert).not.toHaveBeenCalled();
  });

  it("upserts prices returned by manager", async () => {
    const token = makeToken({ id: "id-123", address: "0xDEAD" });
    tokenRepository.findById.mockResolvedValueOnce(token);

    await service.updateTokenPrice("id-123");

    expect(tokenRepository.findById).toHaveBeenCalledWith("id-123");
    expect(tokenPriceTickDao.upsert).toHaveBeenCalledTimes(1);
    expect(tokenPriceTickDao.upsert).toHaveBeenCalledWith({
      tokenId: "id-123",
      source: "Mock",
      price: "1.23",
      updatedAt: new Date("2023-01-01T00:00:00.000Z"),
    });
  });
});
