import { Module } from "@nestjs/common";
import { JobModule } from "../../@lib/job/src";
import { SharedClsModule } from "../../@shared/shared-cls/shared-cls.module";
import { SharedDrizzlePgModule } from "../../@shared/shared-drizzle-pg/shared-drizzle-pg.module";
import { SharedJobModule } from "../../@shared/shared-job";
import { SharedJobBoardModule } from "../../@shared/shared-job-board";
import { SharedZodHttpModule } from "../../@shared/shared-zod-http/shared-zod-http.module";
import { TokenMaintainer } from "./application/maintainer/token.maintainer";
import { TokenPriceUpdateService } from "./application/service/token-price-update.service";
import { TokenPriceTrickBullHandler } from "./infrastructure/bull-handler/token-price-trick.bull-handler";
import { MockTokenPriceAdapter } from "./infrastructure/adapter/token-price/mock-token-price.adapter";
import { TokenPriceService } from "./application/service/token-price.service";
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
    SharedJobModule,
    SharedJobBoardModule,
    JobModule.registerQueue({
      name: TokenPriceTrickBullHandler.getName(),
    }),
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
    TokenPriceUpdateService,
    CreateTokenConsumer,
    TokenMaintainer,
    TokenRepository,
    TokenPriceTrickBullHandler,
  ],
  controllers: [TokenController],
})
export class TokenTickerModule {}
