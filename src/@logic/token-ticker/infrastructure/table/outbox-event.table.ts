import {jsonb, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';

export const outboxEventTable = pgTable('outbox_event', {
  // Unique identifier of the event (UUID).
  // Can be used for idempotency checks.
  id: uuid('id').primaryKey().defaultRandom(),

  // Type of the aggregate that produced the event (e.g. "User", "Order").
  // Usually propagated into Kafka headers for additional context.
  aggregateType: text('aggregate_type').notNull(),

  // Identifier of the aggregate instance (usually UUID).
  // Debezium Outbox Router will use this field as Kafka message.key,
  // ensuring that all events of the same aggregate go to the same partition
  // and preserve ordering.
  aggregateId: uuid('aggregate_id').notNull(),

  // Domain event type (e.g. "user.created", "order.paid").
  // The Outbox Router can build the topic name from this field:
  // topic = app.events.${type}
  type: text('type').notNull(),

  // Main event payload (JSON body).
  // Will be mapped into Kafka → message.value.
  payload: jsonb('payload').notNull(),

  // Additional metadata (e.g. traceId, correlationId).
  // Will be mapped into Kafka → message.headers.
  headers: jsonb('headers').notNull().default('{}'),

  // Event creation timestamp.
  // The Outbox Router will map this into Kafka message timestamp.
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
