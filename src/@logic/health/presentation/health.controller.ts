import { Controller, Get } from "@nestjs/common";
import { HealthCheck } from "@nestjs/terminus";
import { HealthMaintainer } from "../application/health.maintainer";

@Controller("health")
export class HealthController {
  constructor(private readonly healthMaintainer: HealthMaintainer) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthMaintainer.check();
  }
}
