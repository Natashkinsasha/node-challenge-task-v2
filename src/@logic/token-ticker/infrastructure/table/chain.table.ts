import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const chainTable = pgTable('chains', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  debridgeId: integer('debridge_id').unique().notNull(),
  name: text('name').notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
