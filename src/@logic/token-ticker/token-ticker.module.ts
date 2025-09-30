import { Module } from "@nestjs/common";
import { SharedDrizzlePostgresModule } from "../../@shared/shared-drizzle-postgres/shared-drizzle-postgres.module";
import { SharedKafkaModule } from "../../@shared/shared-kafka/shared-kafka.module";
import { MockTokenPriceAdapter } from "./infrastructure/adapter/token-price/mock-token-price.adapter";
import { TokenPriceManager } from "./infrastructure/adapter/token-price/token-price.manager";
import { TokenPriceConsumer } from "./infrastructure/consumer/token-price.consumer";
import { TokenPriceProducer } from "./infrastructure/producer/token-price.producer";

@Module({
  imports: [SharedKafkaModule, SharedDrizzlePostgresModule],
  providers: [
    TokenPriceManager,
    MockTokenPriceAdapter,
    TokenPriceConsumer,
    TokenPriceProducer,
  ],
})
export class TokenTickerModule {}
