import { TokenDao } from "../dao/token.dao";

export type TokenWithChain = NonNullable<
  Awaited<ReturnType<TokenDao["findById"]>>
>;
