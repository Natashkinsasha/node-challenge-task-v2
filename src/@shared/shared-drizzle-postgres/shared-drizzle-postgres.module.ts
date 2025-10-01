import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as schema from "../../@logic/token-ticker/infrastructure/table";
import { SharedConfigModule } from "../shared-config/shared-config.module";

@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      imports: [SharedConfigModule],
      tag: "DB",
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const url = configService.get("DATABASE_URL");
        return {
          postgres: {
            url,
          },
          config: { schema },
        };
      },
    }),
  ],
  exports: [DrizzlePostgresModule],
})
export class SharedDrizzlePostgresModule {}
