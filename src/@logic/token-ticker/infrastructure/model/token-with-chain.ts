import { z } from 'zod';

import { selectChainSchema } from './select-chain';
import { selectTokenSchema } from './select-token';

export const tokenWithChainSchema = selectTokenSchema.extend({
  chain: selectChainSchema,
});

export type TokenWithChain = z.infer<typeof tokenWithChainSchema>;
