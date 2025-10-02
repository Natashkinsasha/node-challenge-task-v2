import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { chainTable } from "../table";

export const selectChainSchema = createSelectSchema(chainTable);

export type SelectChain = z.infer<typeof selectChainSchema>;
