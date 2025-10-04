import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

import { AppDrizzleTransactionHost } from '../../../@shared/shared-cls/app-drizzle-transaction-host';

@Injectable()
export class PgHealthIndicator {
  constructor(
    private readonly txHost: AppDrizzleTransactionHost,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async pingCheck(key = 'database'): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await this.txHost.tx.execute(sql`select 1`);
      return indicator.up();
    } catch (e) {
      return indicator.down();
    }
  }
}
