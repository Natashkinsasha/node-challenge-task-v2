import { z } from 'zod';

export const schemaCreateTokenPayload = z.object({
  tokenId: z.string(),
});

export type CreateTokenPayload = z.infer<typeof schemaCreateTokenPayload>;
