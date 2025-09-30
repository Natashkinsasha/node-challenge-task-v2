import { Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import {
  ClsPluginTransactional,
  getTransactionHostToken,
} from "@nestjs-cls/transactional";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { SharedDrizzlePostgresModule } from "../shared-drizzle-postgres/shared-drizzle-postgres.module";
import { AppDrizzleTransactionHost } from "./app-drizzle-transaction-host";

@Module({
  imports: [
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [SharedDrizzlePostgresModule],
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: "DB",
          }),
          connectionName: "pg",
        }),
      ],
    }),
  ],
  providers: [
    {
      useExisting: getTransactionHostToken("pg"),
      provide: AppDrizzleTransactionHost,
    },
  ],
})
export class SharedClsModule {}
