import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { chainTable } from './chain.table';

export const tokenTable = pgTable(
  'tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    address: text('address').notNull(),
    chainId: uuid('chain_id')
      .notNull()
      .references(() => chainTable.id),
    symbol: text('symbol').notNull(),
    name: text('name').notNull(),
    decimals: smallint('decimals').default(0).notNull(),
    isNative: boolean('is_native').default(false).notNull(),
    isProtected: boolean('is_protected').default(false).notNull(),
    lastUpdateAuthor: text('last_update_author'),
    priority: integer('priority').default(0).notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
  },
  (table) => ({
    chainAddressUq: uniqueIndex('tokens_chain_id_address_uq').on(
      table.chainId,
      table.address,
    ),
  }),
);

export const tokenRelations = relations(tokenTable, ({ one }) => ({
  chain: one(chainTable, {
    fields: [tokenTable.chainId],
    references: [chainTable.id],
  }),
}));
