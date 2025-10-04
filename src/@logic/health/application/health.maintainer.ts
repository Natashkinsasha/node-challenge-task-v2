import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';

import { PgHealthIndicator } from '../health-indicator/pg-health-indicator.service';

@Injectable()
export class HealthMaintainer {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly pgHealthIndicator: PgHealthIndicator,
  ) {}

  public async check() {
    return this.healthCheckService.check([
      () => this.pgHealthIndicator.pingCheck('pg'),
    ]);
  }
}
