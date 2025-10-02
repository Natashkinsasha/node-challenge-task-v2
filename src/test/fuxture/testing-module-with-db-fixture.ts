import { DrizzlePGModule } from "@knaadh/nestjs-drizzle-pg";
import {
  ClsPluginTransactional,
  getTransactionHostToken,
} from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { Provider, Type } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ClsModule } from "nestjs-cls";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { AppDrizzleTransactionHost } from "../../@shared/shared-cls/app-drizzle-transaction-host";
import { PostgresFixture } from "./postgres-fixture";

export class TestingModuleWithDbFixture {
  private postgresFixture?: PostgresFixture;
  private db?: NodePgDatabase;
  private module?: TestingModule;

  private constructor(private readonly providers: Array<Provider>) {}

  public getDb() {
    if (!this.db) {
      throw new Error("DB is not initialized");
    }
    return this.db;
  }

  public static create(providers: Array<Provider>) {
    return new TestingModuleWithDbFixture(providers);
  }

  public async start() {
    this.postgresFixture = PostgresFixture.create();

    const postgresUrl = await this.postgresFixture.getUrl();

    this.module = await Test.createTestingModule({
      imports: [
        DrizzlePGModule.register({
          tag: "DB",
          pg: {
            connection: "pool",
            config: {
              connectionString: postgresUrl,
            },
          },
          config: { schema },
        }),
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              adapter: new TransactionalAdapterDrizzleOrm({
                drizzleInstanceToken: "DB",
                defaultTxOptions: {
                  isolationLevel: "read committed",
                },
              }),
              connectionName: "pg",
            }),
          ],
        }),
      ],
      providers: [
        ...this.providers,
        {
          useExisting: getTransactionHostToken("pg"),
          provide: AppDrizzleTransactionHost,
        },
      ],
    }).compile();
    await this.module.init();
    this.db = this.module.get("DB");
  }

  public async stop() {
    // Close Nest testing module to release DI resources.
    await this.module?.close();
    // await this.postgresFixture?.stop();
    // IMPORTANT: Do not stop the Postgres testcontainer here.
    // Stopping it while pg clients/pools still exist causes unhandled
    // "terminating connection due to administrator command" errors in Jest.
    // Testcontainers will clean up containers on process exit.
  }

  public get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | Function | string | symbol
  ): TResult {
    if (!this.module) {
      throw new Error("Module is not initialized");
    }
    return this.module?.get(typeOrToken);
  }

  public async dropAllAndMigrate() {
    if (!this.db) {
      throw new Error("DB is not initialized");
    }
    await this.postgresFixture?.dropAllAndMigrate(this.db);
  }
}
