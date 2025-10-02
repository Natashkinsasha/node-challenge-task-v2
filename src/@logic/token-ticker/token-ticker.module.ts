import { Module } from "@nestjs/common";
import {PGBossModule} from "../../@lib/pg-boss";
import { SharedClsModule } from "../../@shared/shared-cls/shared-cls.module";
import { SharedDrizzlePgModule } from "../../@shared/shared-drizzle-pg/shared-drizzle-pg.module";
import { SharedKafkaModule } from "../../@shared/shared-kafka/shared-kafka.module";
import { SharedPgBossModule } from "../../@shared/shared-pg-boss/shared-pg-boss.module";
import { TokenPriceUpdateService } from "./application/service/token-price-update.service";
import { MockTokenPriceAdapter } from "./infrastructure/adapter/token-price/mock-token-price.adapter";
import { TokenPriceService } from "./application/service/token-price.service";
import { StoreTokenPriceTickBossHandler } from "./infrastructure/boss-handler/store-token-price-tick.boss-handler";
import { StoreTokenPriceTickJob } from "./infrastructure/boss-job/store-token-price-tick.boss-job";
import { CreateTokenConsumer } from "./infrastructure/consumer/create-token.consumer";
import { ChainDao } from "./infrastructure/dao/chain.dao";
import { TokenLogoDao } from "./infrastructure/dao/token-logo.dao";
import { TokenPriceTickDao } from "./infrastructure/dao/token-price-tick.dao";
import { TokenDao } from "./infrastructure/dao/token.dao";

@Module({
  imports: [
    SharedClsModule,
    SharedDrizzlePgModule,
    SharedKafkaModule,
    SharedPgBossModule,
    PGBossModule.forJobs([StoreTokenPriceTickJob]),
  ],
  providers: [
    TokenDao,
    TokenPriceTickDao,
    ChainDao,
    TokenLogoDao,
    TokenPriceService,
    MockTokenPriceAdapter,
    StoreTokenPriceTickBossHandler,
    TokenPriceUpdateService,
    CreateTokenConsumer,
  ],
})
export class TokenTickerModule {}
