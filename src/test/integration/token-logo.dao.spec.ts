import { TokenLogoDao } from '../../@logic/token-ticker/infrastructure/dao/token-logo.dao';
import { TestingModuleWithDbFixture } from '../fuxture/testing-module-with-db-fixture';

describe('TokenLogoDao (integration)', () => {
  let fixture: TestingModuleWithDbFixture;

  beforeAll(async () => {
    fixture = TestingModuleWithDbFixture.create([TokenLogoDao]);
    await fixture.start();
  }, 60_000);

  beforeEach(async () => {
    await fixture.dropAllAndMigrate();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it('should insert logo for token via single DAO call', async () => {
    const tokenLogoDao = fixture.get(TokenLogoDao);

    const updated = await tokenLogoDao.insert({
      bigRelativePath: 'logos/big/new.png',
      smallRelativePath: 'logos/small/new.png',
      thumbRelativePath: 'logos/thumb/new.png',
    });

    expect(updated).toBeTruthy();
    expect(updated.bigRelativePath).toBe('logos/big/new.png');
    expect(updated.smallRelativePath).toBe('logos/small/new.png');
    expect(updated.thumbRelativePath).toBe('logos/thumb/new.png');
  });
});
