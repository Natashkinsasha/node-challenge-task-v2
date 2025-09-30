import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { tokenTable } from "./token.table";

export const tokenLogoTable = pgTable("token_logos", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenId: uuid("token_id").references(() => tokenTable.id),
  bigRelativePath: text("big_relative_path").notNull(),
  smallRelativePath: text("small_relative_path").notNull(),
  thumbRelativePath: text("thumb_relative_path").notNull(),
});
