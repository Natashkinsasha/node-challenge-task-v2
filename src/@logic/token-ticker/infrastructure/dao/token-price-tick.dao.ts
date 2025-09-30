import { Injectable } from "@nestjs/common";
import { AppDrizzleTransactionHost } from "../../../../@shared/shared-cls/app-drizzle-transaction-host";
import * as tables from "../table";

@Injectable()
export class TokenPriceTickDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async upsert(
    data: typeof tables.tokenPriceTickTable.$inferInsert
  ): Promise<typeof tables.tokenPriceTickTable.$inferSelect> {
    const [row] = await this.txHost.tx
      .insert(tables.tokenPriceTickTable)
      .values(data)
      .onConflictDoUpdate({
        target: [
          tables.tokenPriceTickTable.tokenId,
          tables.tokenPriceTickTable.updatedAt,
          tables.tokenPriceTickTable.source,
        ],
        set: {
          price: data.price,
        },
      })
      .returning();

    return row;
  }
}
