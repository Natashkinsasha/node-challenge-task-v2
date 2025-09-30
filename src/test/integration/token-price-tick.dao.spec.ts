import { randomUUID } from "crypto";
import { seed } from "drizzle-seed";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { TestingModuleWithDbFixture } from "../fuxture/testing-module-with-db-fixture";
import { TokenPriceTickDao } from "../../@logic/token-ticker/infrastructure/dao/token-price-tick.dao";

describe("TokenPriceTickDao (integration)", () => {
  let fixture: TestingModuleWithDbFixture;

  beforeAll(async () => {
    fixture = TestingModuleWithDbFixture.create([TokenPriceTickDao]);
    await fixture.start();
  }, 60_000);

  beforeEach(async () => {
    await fixture.dropAllAndMigrate();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it("should upsert by (tokenId, updatedAt, source) and update price on conflict (single DAO call)", async () => {
    const db = fixture.getDb();
    const dao = fixture.get(TokenPriceTickDao);

    const chainId = randomUUID();
    const tokenId = randomUUID();
    const source = "coingecko";
    const ts = new Date("2024-01-01T00:00:00.000Z");

    await seed(db, { chains: schema.chainTable, tokens: schema.tokenTable }).refine((f) => {
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
            address: f.valuesFromArray({ values: ["0x0000000000000000000000000000000000000000"] }),
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

    await db
      .insert(schema.tokenPriceTickTable)
      .values({ tokenId, price: "1000", updatedAt: ts, source });

    const updated = await dao.upsert({
      tokenId,
      price: "2000",
      updatedAt: ts,
      source,
    });

    expect(updated).toBeTruthy();
    expect(updated.tokenId).toBe(tokenId);
    expect(updated.source).toBe(source);
    expect(updated.price).toBe("2000");
    expect(updated.updatedAt instanceof Date || updated.updatedAt === null).toBe(true);
    expect(updated.updatedAt).toBeTruthy();
    if (updated.updatedAt) {
      expect(updated.updatedAt.toISOString()).toBe(ts.toISOString());
    }
  });
});
