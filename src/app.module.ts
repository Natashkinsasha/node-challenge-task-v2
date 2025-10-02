import { Module } from "@nestjs/common";
import { TokenTickerModule } from "./@logic/token-ticker/token-ticker.module";
import { HealthModule } from "./@logic/health/health.module";

@Module({
  imports: [TokenTickerModule, HealthModule],
  controllers: [],
})
export class AppModule {}
