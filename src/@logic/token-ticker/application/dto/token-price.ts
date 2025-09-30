import * as z from "zod";

const TokenPriceSchema = z.object({
  value: z.string(),
  date: z.date(),
});

export type TokenPrice = z.infer<typeof TokenPriceSchema>;
