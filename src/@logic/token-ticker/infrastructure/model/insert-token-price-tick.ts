import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tokenPriceTickTable } from "../table";

export const insertTokenPriceTickSchema =
  createInsertSchema(tokenPriceTickTable);

export type InsertTokenPriceTick = z.infer<typeof insertTokenPriceTickSchema>;
