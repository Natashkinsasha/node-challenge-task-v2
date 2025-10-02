import { z } from "zod";
import { selectTokenSchema } from "./select-token";
import { selectChainSchema } from "./select-chain";

export const tokenWithChainSchema = selectTokenSchema.extend({
  chain: selectChainSchema,
});

export type TokenWithChain = z.infer<typeof tokenWithChainSchema>;
