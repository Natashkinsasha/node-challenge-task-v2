import {randomUUID} from "crypto";
import { setTimeout as sleep } from 'node:timers/promises';
import {INestApplication, Logger} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {PGBossModule} from "../../@lib/pg-boss";
import { StoreTokenPriceTickJob } from "../../@logic/token-ticker/infrastructure/boss-job/store-token-price-tick.boss-job";
import { StoreTokenPriceTickBossHandler } from "../../@logic/token-ticker/infrastructure/boss-handler/store-token-price-tick.boss-handler";
import { TokenPriceUpdateService } from "../../@logic/token-ticker/application/service/token-price-update.service";
import { CreateTokenConsumer } from "../../@logic/token-ticker/infrastructure/consumer/create-token.consumer";
import { PostgresFixture } from "../fuxture/postgres-fixture";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

describe("CreateTokenConsumer (integration)", () => {
  let fixture: PostgresFixture;
  let app: INestApplication;

  beforeAll(async () => {
    fixture = PostgresFixture.create();
      const connectionString = await fixture.getUrl();
      const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [
              PGBossModule.forRoot({ connectionString, onError: (error) => {
                      Logger.error(error.message, error.stack, "PgBossModule");
                  } }),
              PGBossModule.forJobs([StoreTokenPriceTickJob]),
          ],
          providers: [
              StoreTokenPriceTickBossHandler,
              CreateTokenConsumer,
              {
                  provide: TokenPriceUpdateService,
                  useValue: mockDeep<TokenPriceUpdateService>(),
              },
          ],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
  }, 120_000);


  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it.skip("handles StoreTokenPriceTick job and calls TokenPriceUpdateService", async () => {
    const tokenId = randomUUID();
    const consumer = app.get<CreateTokenConsumer>(CreateTokenConsumer);
    const updateMock = app.get<DeepMockProxy<TokenPriceUpdateService>>(
      TokenPriceUpdateService
    );
    await consumer.handlerTokenCreate(tokenId, "*/1 * * * * *");
    await sleep(10000);
    expect(updateMock.updateTokenPrice).toHaveBeenCalledWith(tokenId);
  }, 15_000);
});
