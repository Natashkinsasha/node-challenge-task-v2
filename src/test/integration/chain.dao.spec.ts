import { seed } from 'drizzle-seed';

import { ChainDao } from '../../@logic/token-ticker/infrastructure/dao/chain.dao';
import * as schema from '../../@logic/token-ticker/infrastructure/table';
import { TestingModuleWithDbFixture } from '../fuxture/testing-module-with-db-fixture';

describe('ChainDao (integration)', () => {
  let fixture: TestingModuleWithDbFixture;

  beforeAll(async () => {
    fixture = TestingModuleWithDbFixture.create([ChainDao]);
    await fixture.start();
  }, 60_000);

  beforeEach(async () => {
    await fixture.dropAllAndMigrate();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it('should upsert chain by debridgeId and update name/isEnabled on conflict', async () => {
    const chainDao = fixture.get(ChainDao);
    const debridgeId = Math.floor(Math.random() * 1_000_000_000);
    await seed(fixture.getDb(), { chains: schema.chainTable }).refine((f) => {
      return {
        chains: {
          count: 1,
          columns: {
            debridgeId: f.valuesFromArray({ values: [debridgeId] }),
          },
        },
      };
    });
    const updated = await chainDao.upsert({
      debridgeId,
      name: 'Ethereum Mainnet',
      isEnabled: false,
    });
    expect(updated.debridgeId).toBe(debridgeId);
    expect(updated.name).toBe('Ethereum Mainnet');
    expect(updated.isEnabled).toBe(false);
  });
});
