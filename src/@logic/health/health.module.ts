import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthMaintainer } from "./application/health.maintainer";
import { HealthController } from "./presentation/health.controller";
import { PgHealthIndicator } from "./health-indicator/pg-health-indicator.service";
import { SharedClsModule } from "../../@shared/shared-cls/shared-cls.module";

@Module({
  imports: [TerminusModule, SharedClsModule],
  controllers: [HealthController],
  providers: [PgHealthIndicator, HealthMaintainer],
})
export class HealthModule {}
