import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tokenLogoTable } from '../table';

export const insertTokenLogoSchema = createInsertSchema(tokenLogoTable);

export type InsertTokenLogo = z.infer<typeof insertTokenLogoSchema>;
