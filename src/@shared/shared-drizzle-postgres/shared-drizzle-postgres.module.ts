import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { Module } from "@nestjs/common";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { SharedConfigModule } from "../shared-config/shared-config.module";

@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      imports: [SharedConfigModule],
        tag: 'DB',
      useFactory() {
        return {
          postgres: {
            url: "postgres://postgres:@127.0.0.1:5432/drizzleDB",
          },
          config: { schema },
        };
      },
    }),
  ],
  exports: [DrizzlePostgresModule],
})
export class SharedDrizzlePostgresModule {}
