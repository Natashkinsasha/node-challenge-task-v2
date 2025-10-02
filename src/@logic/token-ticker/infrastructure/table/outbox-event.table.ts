import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Debezium Outbox-compatible table shape
// Columns match common Outbox Event Router expectations
// - payload is a JSON string (TEXT)
export const outboxEventTable = pgTable("outbox_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: text("aggregate_id").notNull(),
  type: text("type").notNull(),
  payload: text("payload").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
