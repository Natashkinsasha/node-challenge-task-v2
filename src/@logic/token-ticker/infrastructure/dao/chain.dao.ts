import { Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';

import { AppDrizzleTransactionHost } from '../../../../@shared/shared-cls/app-drizzle-transaction-host';
import * as tables from '../table';

@Injectable()
export class ChainDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async upsert(
    data: typeof tables.chainTable.$inferInsert,
  ): Promise<typeof tables.chainTable.$inferSelect> {
    const [row] = await this.txHost.tx
      .insert(tables.chainTable)
      .values(data)
      .onConflictDoUpdate({
        target: tables.chainTable.debridgeId,
        set: {
          name: data.name,
          isEnabled: data.isEnabled,
        },
      })
      .returning();

    return row;
  }

  public async findPageSortedByCreatedAt(params: {
    limit: number;
    offset: number;
  }): Promise<(typeof tables.chainTable.$inferSelect)[]> {
    const { limit, offset } = params;
    return this.txHost.tx
      .select()
      .from(tables.chainTable)
      .orderBy(desc(tables.chainTable.createdAt))
      .limit(limit)
      .offset(offset);
  }
}
