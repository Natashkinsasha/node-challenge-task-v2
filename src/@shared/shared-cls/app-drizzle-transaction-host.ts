import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as tables from "../../@logic/token-ticker/infrastructure/table";

export class AppDrizzleTransactionHost extends TransactionHost<
  TransactionalAdapterDrizzleOrm<PostgresJsDatabase<typeof tables>>
> {}
