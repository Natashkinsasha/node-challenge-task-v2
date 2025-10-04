import { Test } from '@nestjs/testing';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { zocker } from 'zocker';

import { insertChainSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-chain';
import { insertTokenSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-token';
import { insertTokenLogoSchema } from '../src/@logic/token-ticker/infrastructure/model/insert-token-logo';
import * as tables from '../src/@logic/token-ticker/infrastructure/table';
import { AppDrizzleTransactionHost } from '../src/@shared/shared-cls/app-drizzle-transaction-host';
import { SharedClsModule } from '../src/@shared/shared-cls/shared-cls.module';
import { Transaction } from '../src/@shared/shared-cls/transaction';

class Inserter {
  @Transaction()
  public async execute(db: NodePgDatabase<typeof tables>) {
    const chainInput = zocker(insertChainSchema).setSeed(42).generate();

    const [ethChain] = await db
      .insert(tables.chainTable)
      .values(chainInput)
      .returning();

    const tokenInput = zocker(insertTokenSchema)
      .supply(insertTokenSchema.shape.chainId, ethChain.id)
      .generate();

    const [ethToken] = await db
      .insert(tables.tokenTable)
      .values(tokenInput)
      .returning();

    const logoInput = zocker(insertTokenLogoSchema)
      .supply(insertTokenLogoSchema.shape.tokenId, ethToken.id)
      .generate();

    await db.insert(tables.tokenLogoTable).values([logoInput]);
  }
}

export async function main() {
  const module = await Test.createTestingModule({
    imports: [SharedClsModule],
  }).compile();

  await module.init();

  const host = module.get<AppDrizzleTransactionHost>(AppDrizzleTransactionHost);

  await new Inserter().execute(host.tx);
}

main();
