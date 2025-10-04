import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { TokenInfo } from '../../@logic/token-ticker/application/dto/token-info';
import { TokenPriceService } from '../../@logic/token-ticker/application/service/token-price.service';
import { TokenPriceUpdateService } from '../../@logic/token-ticker/application/service/token-price-update.service';
import { TokenPriceAdapter } from '../../@logic/token-ticker/infrastructure/adapter/token-price/token-price.adapter';
import { TokenDao } from '../../@logic/token-ticker/infrastructure/dao/token.dao';
import { TokenPriceTickDao } from '../../@logic/token-ticker/infrastructure/dao/token-price-tick.dao';
import { TestingModuleWithDbFixture } from '../fuxture/testing-module-with-db-fixture';

class TestTokenPriceAdapter extends TokenPriceAdapter {
  private readonly fixedDate = new Date('2023-01-01T00:00:00.000Z');
  private readonly fixedValue = '1.23';
  async getPrice(_token: TokenInfo) {
    return { value: this.fixedValue, date: this.fixedDate };
  }
  protected getSource(): string {
    return 'Mock';
  }
}

describe('TokenPriceUpdateService', () => {
  let fixture: TestingModuleWithDbFixture;

  beforeAll(async () => {
    const tokenDao = mockDeep<TokenDao>();
    const tokenPriceTickDao = mockDeep<TokenPriceTickDao>();
    fixture = TestingModuleWithDbFixture.create([
      TokenPriceUpdateService,
      TokenPriceService,
      { provide: TokenDao, useValue: tokenDao },
      { provide: TokenPriceTickDao, useValue: tokenPriceTickDao },
      TestTokenPriceAdapter,
    ]);
    await fixture.start();
  }, 60_000);

  beforeEach(async () => {
    await fixture.dropAllAndMigrate();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it('throws if token not found', async () => {
    const tokenDao = fixture.get<DeepMockProxy<TokenDao>>(TokenDao);
    const service = fixture.get<DeepMockProxy<TokenPriceUpdateService>>(
      TokenPriceUpdateService,
    );
    const tokenPriceTickDao =
      fixture.get<DeepMockProxy<TokenPriceTickDao>>(TokenPriceTickDao);
    tokenDao.findById.mockResolvedValueOnce(undefined);
    await expect(service.updateTokenPrice('missing-id')).rejects.toThrow(
      'Token not found',
    );
    expect(tokenPriceTickDao.upsert).not.toHaveBeenCalled();
  });

  it('upserts prices returned by manager', async () => {
    const tokenDao = fixture.get<DeepMockProxy<TokenDao>>(TokenDao);
    const service = fixture.get<DeepMockProxy<TokenPriceUpdateService>>(
      TokenPriceUpdateService,
    );
    const tokenPriceTickDao =
      fixture.get<DeepMockProxy<TokenPriceTickDao>>(TokenPriceTickDao);
    tokenDao.findById.mockResolvedValueOnce({
      id: 'id-123',
      address: '0xABC',
      chainId: 'chain-1',
      symbol: 'ABC',
      name: 'ABC',
      decimals: 18,
      isNative: false,
      isProtected: false,
      lastUpdateAuthor: 'author-1',
      priority: 0,
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      chain: {
        id: 'chain-1',
        debridgeId: 1,
        name: 'Chain 1',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        isEnabled: true,
      },
    });

    await service.updateTokenPrice('id-123');

    expect(tokenDao.findById).toHaveBeenCalledWith('id-123');
    expect(tokenPriceTickDao.upsert).toHaveBeenCalledTimes(1);
    expect(tokenPriceTickDao.upsert).toHaveBeenCalledWith({
      tokenId: 'id-123',
      source: 'Mock',
      price: '1.23',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
  });
});
