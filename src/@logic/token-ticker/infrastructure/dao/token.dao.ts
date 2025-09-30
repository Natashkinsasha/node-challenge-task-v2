import { InjectDrizzle } from "@knaadh/nestjs-drizzle-postgres";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as tables from "../table";

@Injectable()
export class TokenDao {
  constructor(
    @InjectDrizzle('DB') private readonly db: PostgresJsDatabase<typeof tables>
  ) {}

  public async upsert(
    data: typeof tables.tokenTable.$inferInsert
  ): Promise<typeof tables.tokenTable.$inferSelect> {
    const [row] = await this.db
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
    return this.db.query.tokenTable.findFirst({
      where: eq(tables.tokenTable.id, id),
      with: {
        chain: true,
      },
    });
  }
}
