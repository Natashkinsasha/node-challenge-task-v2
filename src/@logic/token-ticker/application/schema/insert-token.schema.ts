import { createInsertSchema } from "drizzle-zod";
import { tokenTable } from "../../infrastructure/table";

export const insertTokenSchema = createInsertSchema(tokenTable);
