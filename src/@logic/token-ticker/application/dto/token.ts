import { z } from 'zod';

import { selectTokenSchema } from '../../infrastructure/model/select-token';

export const tokenSchema = selectTokenSchema.omit({
  timestamp: true,
});

export type Token = z.infer<typeof tokenSchema>;
