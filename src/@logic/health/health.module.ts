import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { SharedClsModule } from '../../@shared/shared-cls/shared-cls.module';
import { HealthMaintainer } from './application/health.maintainer';
import { PgHealthIndicator } from './health-indicator/pg-health-indicator.service';
import { HealthController } from './presentation/health.controller';

@Module({
  imports: [TerminusModule, SharedClsModule],
  controllers: [HealthController],
  providers: [PgHealthIndicator, HealthMaintainer],
})
export class HealthModule {}
