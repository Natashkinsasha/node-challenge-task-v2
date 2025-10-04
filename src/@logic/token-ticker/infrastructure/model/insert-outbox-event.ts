import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { outboxEventTable } from '../table';

export const insertOutboxEventSchema = createInsertSchema(outboxEventTable);

export type InsertOutboxEvent = z.infer<typeof insertOutboxEventSchema>;
