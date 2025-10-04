import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { tokenSchema } from '../../../application/dto/token';

const createTokenResponseSchema = z.object({
  token: tokenSchema,
});

export class CreateTokenResponse extends createZodDto(
  createTokenResponseSchema,
) {}
