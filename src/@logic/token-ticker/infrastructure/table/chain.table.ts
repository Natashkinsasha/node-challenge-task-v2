import { integer, pgTable, text, uuid, boolean } from "drizzle-orm/pg-core";

export const chainTable = pgTable("chains", {
  id: uuid("id").primaryKey().defaultRandom(),
  debridgeId: integer("debridge_id").unique(),
  name: text("name").notNull(),
  isEnabled: boolean("is_enabled").default(true),
});
