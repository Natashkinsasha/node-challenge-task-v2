import { Module } from '@nestjs/common';

import { HealthModule } from './@logic/health/health.module';
import { TokenTickerModule } from './@logic/token-ticker/token-ticker.module';

@Module({
  imports: [TokenTickerModule, HealthModule],
  controllers: [],
})
export class AppModule {}
