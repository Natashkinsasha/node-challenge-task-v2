import { Injectable } from '@nestjs/common';
import { eq, getTableColumns, sql } from 'drizzle-orm';

import { AppDrizzleTransactionHost } from '../../../../@shared/shared-cls/app-drizzle-transaction-host';
import { InsertToken } from '../model/insert-token';
import { SelectToken } from '../model/select-token';
import { TokenWithChain } from '../model/token-with-chain';
import * as tables from '../table';

@Injectable()
export class TokenDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async upsert(
    data: InsertToken,
  ): Promise<SelectToken & { isInserted: boolean }> {
    const [row] = await this.txHost.tx
      .insert(tables.tokenTable)
      .values(data)
      .onConflictDoUpdate({
        target: [tables.tokenTable.chainId, tables.tokenTable.address],
        set: {
          symbol: data.symbol,
          name: data.name,
          decimals: data.decimals,
          isNative: data.isNative,
          isProtected: data.isProtected,
          lastUpdateAuthor: data.lastUpdateAuthor ?? null,
          priority: data.priority,
          timestamp: new Date(),
        },
      })
      .returning({
        ...getTableColumns(tables.tokenTable),
        isInserted: sql<boolean>`(xmax = 0)`,
      });
    return row;
  }

  public async findById(id: string): Promise<TokenWithChain | undefined> {
    return this.txHost.tx.query.tokenTable.findFirst({
      where: eq(tables.tokenTable.id, id),
      with: {
        chain: true,
      },
    });
  }
}
