import { Injectable } from '@nestjs/common';

import { AppDrizzleTransactionHost } from '../../../../@shared/shared-cls/app-drizzle-transaction-host';
import { InsertOutboxEvent } from '../model/insert-outbox-event';
import * as tables from '../table';

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
      })
      .returning({ id: tables.outboxEventTable.id });

    return row;
  }
}
