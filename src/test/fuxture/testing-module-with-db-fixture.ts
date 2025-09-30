import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import {
  ClsPluginTransactional,
  getTransactionHostToken,
} from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { Type } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { ClsModule } from "nestjs-cls";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { AppDrizzleTransactionHost } from "../../@shared/shared-cls/app-drizzle-transaction-host";
import { PostgresFixture } from "./postgres-fixture";

export class TestingModuleWithDbFixture {
  private postgresFixture?: PostgresFixture;
  private db?: PostgresJsDatabase;
  private module?: TestingModule;

  private constructor(private readonly providers: Array<Type<any>>) {}

  public getDb() {
    if (!this.db) {
      throw new Error("DB is not initialized");
    }
    return this.db;
  }

  public static create(providers: Array<Type<any>>) {
    return new TestingModuleWithDbFixture(providers);
  }

  public async start() {
    this.postgresFixture = PostgresFixture.create();

    const postgresUrl = await this.postgresFixture.getUrl();

    this.module = await Test.createTestingModule({
      imports: [
        DrizzlePostgresModule.register({
          tag: "DB",
          postgres: {
            url: postgresUrl,
          },
          config: { schema },
        }),
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              adapter: new TransactionalAdapterDrizzleOrm({
                drizzleInstanceToken: "DB",
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
    await this.module?.close();
    await this.postgresFixture?.stop();
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
