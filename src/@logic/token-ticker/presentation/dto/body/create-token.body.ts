import { createZodDto } from 'nestjs-zod';

import { insertTokenSchema } from '../../../infrastructure/model/insert-token';

const createTokenSchema = insertTokenSchema.pick({
  address: true,
  chainId: true,
  logoId: true,
  symbol: true,
  name: true,
  decimals: true,
  isNative: true,
  isProtected: true,
  lastUpdateAuthor: true,
  priority: true,
});

export class CreateTokenBody extends createZodDto(createTokenSchema) {}
