import { z } from "zod";

export const TokenInfoSchema = z.object({
  address: z.string(),
  debridgeId: z.number(),
});

export type TokenInfo = z.infer<typeof TokenInfoSchema>;
