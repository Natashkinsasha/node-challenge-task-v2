import { Module } from "@nestjs/common";
import { PGBossModule } from "../../@lib/pg-boss";
import { SharedClsModule } from "../../@shared/shared-cls/shared-cls.module";
import { SharedDrizzlePgModule } from "../../@shared/shared-drizzle-pg/shared-drizzle-pg.module";
import { SharedPgBossModule } from "../../@shared/shared-pg-boss/shared-pg-boss.module";
import { SharedZodHttpModule } from "../../@shared/shared-zod-http/shared-zod-http.module";
import { TokenMaintainer } from "./application/maintainer/token.maintainer";
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
import { OutboxEventDao } from "./infrastructure/dao/outbox-event.dao";
import { EventService } from "./application/service/event.service";
import { TokenRepository } from "./infrastructure/repository/token.repository";
import { TokenController } from "./presentation/controller/token.controller";

@Module({
  imports: [
    SharedZodHttpModule,
    SharedClsModule,
    SharedDrizzlePgModule,
    SharedPgBossModule,
    PGBossModule.forJobs([StoreTokenPriceTickJob]),
  ],
  providers: [
    TokenDao,
    TokenPriceTickDao,
    ChainDao,
    TokenLogoDao,
    OutboxEventDao,
    EventService,
    TokenPriceService,
    MockTokenPriceAdapter,
    StoreTokenPriceTickBossHandler,
    TokenPriceUpdateService,
    CreateTokenConsumer,
    TokenMaintainer,
    TokenRepository,
  ],
  controllers: [TokenController],
})
export class TokenTickerModule {}
