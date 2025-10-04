import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const tokenLogoTable = pgTable('token_logos', {
  id: uuid('id').primaryKey().defaultRandom(),
  bigRelativePath: text('big_relative_path').notNull(),
  smallRelativePath: text('small_relative_path').notNull(),
  thumbRelativePath: text('thumb_relative_path').notNull(),
});
