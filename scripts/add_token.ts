import { Test } from '@nestjs/testing';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { zocker } from 'zocker';

import { EventService } from '../src/@logic/token-ticker/application/service/event.service';
import { OutboxEventDao } from '../src/@logic/token-ticker/infrastructure/dao/outbox-event.dao';
import { TokenDao } from '../src/@logic/token-ticker/infrastructure/dao/token.dao';
import { insertChainSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-chain';
import { insertTokenSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-token';
import { insertTokenLogoSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-token-logo';
import { TokenRepository } from '../src/@logic/token-ticker/infrastructure/repository/token.repository';
import * as tables from '../src/@logic/token-ticker/infrastructure/table';
import { AppDrizzleTransactionHost } from '../src/@shared/shared-cls/app-drizzle-transaction-host';
import { SharedClsModule } from '../src/@shared/shared-cls/shared-cls.module';

class Inserter {
  public async execute(
    db: NodePgDatabase<typeof tables>,
    tokenRepository: TokenRepository,
  ) {
    const chainInput = zocker(insertChainSchema).generate();

    const [chain] = await db
      .insert(tables.chainTable)
      .values(chainInput)
      .returning();

    const logoInput = zocker(insertTokenLogoSchema).generate();

    const [logo] = await db
      .insert(tables.tokenLogoTable)
      .values(logoInput)
      .returning();

    const tokenInput = zocker(insertTokenSchema)
      .supply(insertTokenSchema.shape.chainId, chain.id)
      .supply(insertTokenSchema.shape.logoId, logo.id)
      .generate();

    await tokenRepository.upsert(tokenInput);
  }
}

export async function main() {
  const module = await Test.createTestingModule({
    imports: [SharedClsModule],
    providers: [TokenRepository, EventService, OutboxEventDao, TokenDao],
  }).compile();

  await module.init();

  const host = module.get<AppDrizzleTransactionHost>(AppDrizzleTransactionHost);

  const tokenRepository = module.get<TokenRepository>(TokenRepository);

  await new Inserter().execute(host.tx, tokenRepository);
}

main();
