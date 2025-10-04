import { randomUUID } from 'crypto';
import { seed } from 'drizzle-seed';

import { TokenDao } from '../../@logic/token-ticker/infrastructure/dao/token.dao';
import * as schema from '../../@logic/token-ticker/infrastructure/table';
import { TestingModuleWithDbFixture } from '../fuxture/testing-module-with-db-fixture';

describe('TokenDao (integration)', () => {
  let fixture: TestingModuleWithDbFixture;

  beforeAll(async () => {
    fixture = TestingModuleWithDbFixture.create([TokenDao]);
    await fixture.start();
  }, 60_000);

  beforeEach(async () => {
    await fixture.dropAllAndMigrate();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it('should upsert token and fetch with relation (chain)', async () => {
    const tokenDao = fixture.get(TokenDao);
    const chainId = randomUUID();
    const logoId = randomUUID();

    await seed(fixture.getDb(), {
      chains: schema.chainTable,
      token_logos: schema.tokenLogoTable,
    }).refine((f) => {
      return {
        chains: {
          count: 1,
          columns: {
            id: f.valuesFromArray({ values: [chainId] }),
          },
        },
        token_logos: {
          count: 1,
          columns: {
            id: f.valuesFromArray({ values: [logoId] }),
          },
        },
      };
    });

    const tokenId = randomUUID();
    const initial = await tokenDao.upsert({
      id: tokenId,
      address: '0x0000000000000000000000000000000000000000',
      chainId,
      logoId,
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      isNative: true,
      isProtected: false,
      lastUpdateAuthor: 'tester',
      priority: 1,
      timestamp: new Date(),
    });
    expect(initial.id).toBe(tokenId);
    expect(initial.chainId).toBe(chainId);
    expect(initial.logoId).toBe(logoId);
    expect(initial.address).toBe('0x0000000000000000000000000000000000000000');
    expect(initial.symbol).toBe('ETH');
    expect(initial.name).toBe('Ether');
    expect(initial.decimals).toBe(18);
    expect(initial.isNative).toBe(true);
    expect(initial.isProtected).toBe(false);
    expect(initial.lastUpdateAuthor).toBe('tester');
    expect(initial.priority).toBe(1);
    expect(initial.timestamp instanceof Date).toBe(true);
  });
});
