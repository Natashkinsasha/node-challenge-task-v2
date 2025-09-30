import { randomUUID } from "crypto";
import { seed } from "drizzle-seed";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { TestingModuleWithDbFixture } from "../fuxture/testing-module-with-db-fixture";
import { TokenLogoDao } from "../../@logic/token-ticker/infrastructure/dao/token-logo.dao";

describe("TokenLogoDao (integration)", () => {
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

  it("should insert logo for token via single DAO call", async () => {
    const db = fixture.getDb();
    const tokenLogoDao = fixture.get(TokenLogoDao);
    const chainId = randomUUID();
    const tokenId = randomUUID();
    await seed(db, {
      chains: schema.chainTable,
      tokens: schema.tokenTable,
    }).refine((f) => {
      return {
        chains: {
          count: 1,
          columns: {
            id: f.valuesFromArray({ values: [chainId] }),
          },
        },
        tokens: {
          count: 1,
          columns: {
            id: f.valuesFromArray({ values: [tokenId] }),
            chainId: f.valuesFromArray({ values: [chainId] }),
            address: f.valuesFromArray({
              values: ["0x0000000000000000000000000000000000000000"],
            }),
            symbol: f.valuesFromArray({ values: ["ETH"] }),
            name: f.valuesFromArray({ values: ["Ether"] }),
            decimals: f.valuesFromArray({ values: [18] }),
            isNative: f.valuesFromArray({ values: [true] }),
            isProtected: f.valuesFromArray({ values: [false] }),
            lastUpdateAuthor: f.valuesFromArray({ values: ["tester"] }),
            priority: f.valuesFromArray({ values: [1] }),
          },
        },
      };
    });

    const updated = await tokenLogoDao.upsert({
      tokenId,
      bigRelativePath: "logos/big/new.png",
      smallRelativePath: "logos/small/new.png",
      thumbRelativePath: "logos/thumb/new.png",
    });

    expect(updated).toBeTruthy();
    expect(updated.tokenId).toBe(tokenId);
    expect(updated.bigRelativePath).toBe("logos/big/new.png");
    expect(updated.smallRelativePath).toBe("logos/small/new.png");
    expect(updated.thumbRelativePath).toBe("logos/thumb/new.png");
  });
});
