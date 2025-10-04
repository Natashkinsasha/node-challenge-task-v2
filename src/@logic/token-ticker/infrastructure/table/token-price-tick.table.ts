import {
  decimal,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { tokenTable } from './token.table';

export const tokenPriceTickTable = pgTable(
  'token_price_ticks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenId: uuid('token_id').references(() => tokenTable.id),
    price: decimal('price', { precision: 28, scale: 0 }).default('0'),
    updatedAt: timestamp('last_price_update').defaultNow(),
    source: text('source').notNull(),
  },
  (table) => ({
    chainAddressUq: uniqueIndex('price_ticks_token_updatedat_source_uq').on(
      table.tokenId,
      table.updatedAt,
      table.source,
    ),
  }),
);
