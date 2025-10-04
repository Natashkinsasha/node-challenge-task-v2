import { z } from 'zod';

export const tokenInfoSchema = z.object({
  address: z.string(),
  debridgeId: z.number(),
});

export type TokenInfo = z.infer<typeof tokenInfoSchema>;
