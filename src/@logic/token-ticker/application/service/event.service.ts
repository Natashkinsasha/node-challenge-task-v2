import { Injectable } from '@nestjs/common';

import { OutboxEventDao } from '../../infrastructure/dao/outbox-event.dao';

export type SendEventParams<T extends { [key: string]: any }> = {
  aggregateType: string;
  aggregateId: string;
  type: string;
  payload: T;
};

@Injectable()
export class EventService {
  constructor(private readonly outboxEventDao: OutboxEventDao) {}

  async send<T extends { [key: string]: any }>(
    params: SendEventParams<T>,
  ): Promise<string> {
    const { aggregateType, aggregateId, type, payload } = params;
    const inserted = await this.outboxEventDao.insert({
      aggregateType,
      aggregateId,
      type,
      payload,
    });
    return inserted.id;
  }
}
