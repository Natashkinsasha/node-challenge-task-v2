import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tokenTable } from '../table';

export const selectTokenSchema = createSelectSchema(tokenTable);

export type SelectToken = z.infer<typeof selectTokenSchema>;
