import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { AppDrizzleTransactionHost } from "../../../../@shared/shared-cls/app-drizzle-transaction-host";

import * as tables from "../table";

@Injectable()
export class TokenDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async upsert(
    data: typeof tables.tokenTable.$inferInsert
  ): Promise<typeof tables.tokenTable.$inferSelect> {
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
      .returning();
    return row;
  }

  public async findById(id: string) {
    return this.txHost.tx.query.tokenTable.findFirst({
      where: eq(tables.tokenTable.id, id),
      with: {
        chain: true,
      },
    });
  }
}
