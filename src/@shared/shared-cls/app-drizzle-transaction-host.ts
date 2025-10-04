import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as tables from '../../@logic/token-ticker/infrastructure/table';

export class AppDrizzleTransactionHost extends TransactionHost<
  TransactionalAdapterDrizzleOrm<NodePgDatabase<typeof tables>>
> {}
