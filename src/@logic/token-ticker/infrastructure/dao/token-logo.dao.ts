import { Injectable } from "@nestjs/common";
import { AppDrizzleTransactionHost } from "../../../../@shared/shared-cls/app-drizzle-transaction-host";
import * as tables from "../table";

@Injectable()
export class TokenLogoDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async upsert(
    data: typeof tables.tokenLogoTable.$inferInsert
  ): Promise<typeof tables.tokenLogoTable.$inferSelect> {
    const [row] = await this.txHost.tx
      .insert(tables.tokenLogoTable)
      .values(data)
      .onConflictDoUpdate({
        target: tables.tokenLogoTable.tokenId,
        set: {
          bigRelativePath: data.bigRelativePath,
          smallRelativePath: data.smallRelativePath,
          thumbRelativePath: data.thumbRelativePath,
        },
      })
      .returning();
    return row;
  }
}
