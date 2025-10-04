import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { chainTable } from '../table';

export const insertChainSchema = createInsertSchema(chainTable);

export type InsertChain = z.infer<typeof insertChainSchema>;
