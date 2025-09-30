import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  smallint,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { chainTable } from "./chain.table";

export const tokenTable = pgTable(
  "tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    address: text("address").notNull(),
    chainId: uuid("chain_id")
      .notNull()
      .references(() => chainTable.id),
    symbol: text("symbol"),
    name: text("name"),
    decimals: smallint("decimals").default(0),
    isNative: boolean("is_native").default(false),
    isProtected: boolean("is_protected").default(false),
    lastUpdateAuthor: text("last_update_author"),
    priority: integer("priority").default(0),
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => ({
    chainAddressUq: uniqueIndex("tokens_chain_id_address_uq").on(
      table.chainId,
      table.address
    ),
  })
);

export const tokenRelations = relations(tokenTable, ({ one }) => ({
  chain: one(chainTable, {
    fields: [tokenTable.chainId],
    references: [chainTable.id],
  }),
}));
