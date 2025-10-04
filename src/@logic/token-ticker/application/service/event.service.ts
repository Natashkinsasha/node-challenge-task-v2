import { Injectable } from '@nestjs/common';

import { OutboxEventDao } from '../../infrastructure/dao/outbox-event.dao';

export type SendEventParams<T> = {
  aggregateType: string;
  aggregateId: string;
  type: string;
  payload: T;
};

@Injectable()
export class EventService {
  constructor(private readonly outboxEventDao: OutboxEventDao) {}

  async send<T>(params: SendEventParams<T>): Promise<string> {
    const { aggregateType, aggregateId, type, payload } = params;

    const json =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    const inserted = await this.outboxEventDao.insert({
      aggregateType,
      aggregateId,
      type,
      payload: json,
    });

    return inserted.id;
  }
}
