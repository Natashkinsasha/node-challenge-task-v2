import { Injectable } from "@nestjs/common";
import { OutboxEventDao } from "../../infrastructure/dao/outbox-event.dao";

export type SendEventParams = {
  aggregateType: string;
  aggregateId: string;
  type: string;
  payload: unknown;
};

@Injectable()
export class EventService {
  constructor(private readonly outboxEventDao: OutboxEventDao) {}

  /**
   * Writes an outbox event inside the current transaction (if any).
   * Kafka Connect (Debezium Outbox) will read it and publish to Kafka.
   * Returns created event id (uuid).
   */
  async send(params: SendEventParams): Promise<string> {
    const { aggregateType, aggregateId, type, payload } = params;

    const json =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    const inserted = await this.outboxEventDao.insert({
      aggregateType,
      aggregateId,
      type,
      payload: json,
    });

    return inserted.id;
  }
}
