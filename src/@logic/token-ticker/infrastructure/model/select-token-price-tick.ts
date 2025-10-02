import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { tokenPriceTickTable } from "../table";

export const selectTokenPriceTickSchema =
  createSelectSchema(tokenPriceTickTable);

export type SelectTokenPriceTick = z.infer<typeof selectTokenPriceTickSchema>;
