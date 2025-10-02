import { Injectable } from "@nestjs/common";
import { AppDrizzleTransactionHost } from "../../../../@shared/shared-cls/app-drizzle-transaction-host";
import * as tables from "../table";
import { InsertOutboxEvent } from "../model/insert-outbox-event";

@Injectable()
export class OutboxEventDao {
  constructor(private readonly txHost: AppDrizzleTransactionHost) {}

  public async insert(data: InsertOutboxEvent) {
    const [row] = await this.txHost.tx
      .insert(tables.outboxEventTable)
      .values({
        aggregateType: data.aggregateType,
        aggregateId: data.aggregateId,
        type: data.type,
        payload: data.payload,
        // timestamp is default NOW() in schema
      })
      .returning({ id: tables.outboxEventTable.id });

    return row;
  }
}
