import { Injectable } from '@nestjs/common';

import { AppDrizzleTransactionHost } from '../../../../@shared/shared-cls/app-drizzle-transaction-host';
import * as tables from '../table';

@Injectable()
export class TokenLogoDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async insert(
    data: typeof tables.tokenLogoTable.$inferInsert,
  ): Promise<typeof tables.tokenLogoTable.$inferSelect> {
    const [row] = await this.txHost.tx
      .insert(tables.tokenLogoTable)
      .values(data)
      .returning();
    return row;
  }
}
