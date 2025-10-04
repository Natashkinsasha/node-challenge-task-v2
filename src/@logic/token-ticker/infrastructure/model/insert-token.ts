import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tokenTable } from '../table';

export const insertTokenSchema = createInsertSchema(tokenTable);

export type InsertToken = z.infer<typeof insertTokenSchema>;
